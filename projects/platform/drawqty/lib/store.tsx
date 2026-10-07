"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_QUOTES, SEED_UPLOADS } from "@/projects/platform/drawqty/lib/mock-data";
import { allItems, totalsFor } from "@/projects/platform/drawqty/lib/calc";
import { NOW_LABEL, receiptNo } from "@/projects/platform/drawqty/lib/format";
import { buildInitialItems, manualSegment, r1, SAMPLE_FILE } from "@/projects/platform/drawqty/lib/plan-data";
import type {
  DrawingKind,
  FloorId,
  PlanItem,
  QuoteRequest,
  QuoteStatus,
  Targets,
  UploadedFile,
  UploadRecord,
} from "@/projects/platform/drawqty/lib/types";

/* 사용자 화면과 관리자 화면은 URL이 달라 브라우저 localStorage로만 데이터를 나눈다. 백엔드는 없다. */
const STORAGE_KEY = "drawqty:v1";

interface Persisted {
  quotes: QuoteRequest[];
  uploads: UploadRecord[];
  statuses: Record<string, QuoteStatus>;
}

function readPersisted(): Persisted {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { quotes: [], uploads: [], statuses: {} };
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return { quotes: parsed.quotes ?? [], uploads: parsed.uploads ?? [], statuses: parsed.statuses ?? {} };
  } catch {
    return { quotes: [], uploads: [], statuses: {} };
  }
}

function writePersisted(value: Persisted) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* 저장소를 못 쓰는 환경에서는 화면 안 상태로만 동작한다 */
  }
}

export interface QuoteForm {
  company: string;
  site: string;
  manager: string;
  phone: string;
  email: string;
  startMonth: string;
  memo: string;
}

interface Store {
  file: UploadedFile | null;
  kind: DrawingKind;
  targets: Targets;
  items: Record<FloorId, PlanItem[]>;
  quotes: QuoteRequest[];
  uploads: UploadRecord[];
  hasManual: boolean;

  setFile: (file: UploadedFile | null) => void;
  setKind: (kind: DrawingKind) => void;
  setTargets: (targets: Targets) => void;
  registerUpload: () => void;
  updateItem: (id: string, patch: { heightM: number; areaM2: number }) => void;
  addManualSegment: (floor: FloorId, heightM: number) => void;
  resetSession: () => void;
  submitQuote: (form: QuoteForm) => string;
  setQuoteStatus: (id: string, status: QuoteStatus) => void;
}

const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("StoreProvider 밖에서 사용할 수 없습니다");
  return ctx;
}

export function StoreProvider({
  children,
  withSample = false,
}: {
  children: ReactNode;
  /* 스크린샷과 시연 진입용: 업로드를 건너뛰고 샘플 도면이 이미 올라간 상태로 시작 */
  withSample?: boolean;
}) {
  const [file, setFile] = useState<UploadedFile | null>(withSample ? SAMPLE_FILE : null);
  const [kind, setKind] = useState<DrawingKind>("건축도면");
  const [targets, setTargets] = useState<Targets>({ scaffold: true, shoring: true });
  const [items, setItems] = useState<Record<FloorId, PlanItem[]>>(buildInitialItems);
  const [persisted, setPersisted] = useState<Persisted>({ quotes: [], uploads: [], statuses: {} });
  const [hydrated, setHydrated] = useState(false);
  const [sessionUploadId, setSessionUploadId] = useState<string | null>(null);

  useEffect(() => {
    /* localStorage는 서버 렌더에 없으므로 마운트 뒤에 한 번 읽는다 (하이드레이션 불일치 방지) */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPersisted(readPersisted());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writePersisted(persisted);
  }, [persisted, hydrated]);

  const quotes = useMemo(
    () =>
      [...persisted.quotes, ...SEED_QUOTES].map((q) =>
        persisted.statuses[q.id] ? { ...q, status: persisted.statuses[q.id] } : q,
      ),
    [persisted],
  );
  const uploads = useMemo(() => [...persisted.uploads, ...SEED_UPLOADS], [persisted.uploads]);

  const hasManual = useMemo(() => allItems(items).some((i) => i.confidence === "수동 수정됨"), [items]);

  const registerUpload = useCallback(() => {
    if (!file) return;
    const id = `UP-${String(413 + persisted.uploads.length).padStart(4, "0")}`;
    setSessionUploadId(id);
    setPersisted((p) => ({
      ...p,
      uploads: [
        {
          id,
          fileName: file.name,
          company: "회사 미입력",
          site: "-",
          uploadedAt: NOW_LABEL,
          sizeMb: file.sizeMb,
          result: "정상",
          scaffoldArea: 0,
          rcVolume: 0,
          deckVolume: 0,
        },
        ...p.uploads,
      ],
    }));
  }, [file, persisted.uploads.length]);

  const updateItem = useCallback((id: string, patch: { heightM: number; areaM2: number }) => {
    setItems((prev) => {
      const next = { ...prev };
      for (const floor of Object.keys(next) as FloorId[]) {
        next[floor] = next[floor].map((it) => {
          if (it.id !== id) return it;
          const areaM2 = r1(patch.areaM2);
          return { ...it, heightM: r1(patch.heightM), areaM2, confidence: "수동 수정됨" };
        });
      }
      return next;
    });
  }, []);

  const addManualSegment = useCallback((floor: FloorId, heightM: number) => {
    setItems((prev) => {
      if (prev[floor].some((i) => i.id === `${floor}-X1`)) return prev;
      return { ...prev, [floor]: [...prev[floor], manualSegment(floor, r1(heightM))] };
    });
  }, []);

  const resetSession = useCallback(() => {
    setFile(null);
    setItems(buildInitialItems());
    setSessionUploadId(null);
  }, []);

  const submitQuote = useCallback(
    (form: QuoteForm) => {
      const totals = totalsFor(allItems(items));
      const seq = persisted.quotes.length + 5;
      const id = receiptNo(seq);
      const scaffoldArea = targets.scaffold ? totals.scaffoldArea : 0;
      const rcVolume = targets.shoring ? totals.rcVolume : 0;
      const deckVolume = targets.shoring ? totals.deckVolume : 0;
      const quote: QuoteRequest = {
        id,
        company: form.company.trim(),
        site: form.site.trim(),
        manager: form.manager.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        startMonth: form.startMonth,
        memo: form.memo.trim(),
        requestedAt: NOW_LABEL,
        fileName: file?.name ?? SAMPLE_FILE.name,
        scaffoldArea,
        rcVolume,
        deckVolume,
        status: "신규",
      };
      const uploadId = sessionUploadId ?? `UP-${String(413 + persisted.uploads.length).padStart(4, "0")}`;
      const record: UploadRecord = {
        id: uploadId,
        fileName: quote.fileName,
        company: quote.company,
        site: quote.site,
        uploadedAt: NOW_LABEL,
        sizeMb: file?.sizeMb ?? SAMPLE_FILE.sizeMb,
        result: hasManual ? "수동 수정 포함" : "정상",
        scaffoldArea,
        rcVolume,
        deckVolume,
      };
      setPersisted((p) => ({
        ...p,
        quotes: [quote, ...p.quotes],
        uploads: [record, ...p.uploads.filter((u) => u.id !== uploadId)],
      }));
      return id;
    },
    [items, targets, persisted.quotes.length, persisted.uploads.length, file, sessionUploadId, hasManual],
  );

  const setQuoteStatus = useCallback((id: string, status: QuoteStatus) => {
    setPersisted((p) => ({ ...p, statuses: { ...p.statuses, [id]: status } }));
  }, []);

  const value: Store = {
    file,
    kind,
    targets,
    items,
    quotes,
    uploads,
    hasManual,
    setFile,
    setKind,
    setTargets,
    registerUpload,
    updateItem,
    addManualSegment,
    resetSession,
    submitQuote,
    setQuoteStatus,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
