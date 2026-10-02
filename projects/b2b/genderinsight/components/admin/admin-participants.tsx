"use client";

import { useMemo, useState } from "react";
import { ArrowsClockwise, FileArrowUp, PaperPlaneTilt, Plus, UploadSimple } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  Cell,
  DefList,
  Drawer,
  Field,
  Input,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Select,
  Table,
} from "@/projects/b2b/genderinsight/components/ui";
import {
  ASSESSMENTS,
  DEPARTMENTS,
  PARTICIPANTS,
  RANKS,
} from "@/projects/b2b/genderinsight/lib/mock-data";
import type { Participant, ParticipantStatus } from "@/projects/b2b/genderinsight/lib/types";

const STATUS_TONE: Record<ParticipantStatus, "neutral" | "info" | "ink" | "danger"> = {
  미발송: "neutral",
  발송완료: "info",
  응답완료: "ink",
  미응답: "danger",
};

const PER_PAGE = 8;

export function AdminParticipants() {
  const [list, setList] = useState<Participant[]>(PARTICIPANTS);
  const [assessmentId, setAssessmentId] = useState("전체");
  const [department, setDepartment] = useState("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Participant | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [draftName, setDraftName] = useState("");

  const filtered = useMemo(
    () =>
      list.filter(
        (p) =>
          (assessmentId === "전체" || p.assessmentId === assessmentId) &&
          (department === "전체" || p.department === department) &&
          (query.trim() === "" || p.name.includes(query.trim())),
      ),
    [list, assessmentId, department, query],
  );

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const reissuePin = (id: string) => {
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pin: String(100000 + Math.abs(id.length * 731 + Date.now() % 900000)).slice(0, 6) } : p)),
    );
  };

  const resend = (id: string) => {
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, status: "발송완료", invitedAt: "2026-01-28" } : p)));
  };

  const addParticipant = () => {
    if (!draftName.trim()) return;
    const id = `p${Date.now()}`;
    setList((prev) => [
      {
        id,
        name: draftName.trim(),
        department: DEPARTMENTS[0],
        rank: RANKS[0],
        unit: "본원",
        email: `${id}@company.kr`,
        phone: "010-0000-0000",
        pin: String(400000 + prev.length * 137).slice(0, 6),
        status: "미발송",
        assessmentId: ASSESSMENTS[1].id,
      },
      ...prev,
    ]);
    setDraftName("");
    setAddOpen(false);
  };

  return (
    <div className="gi-enter space-y-6">
      <PageHead
        eyebrow="참여자 관리"
        title="참여자 관리"
        desc="참여자를 등록하고 PIN 발급, 초대 발송, 참여 여부를 관리합니다."
        actions={
          <>
            <Button variant="secondary" icon={<FileArrowUp size={14} weight="bold" />} onClick={() => setUploadOpen(true)}>
              Excel 일괄 등록
            </Button>
            <Button icon={<Plus size={14} weight="bold" />} onClick={() => setAddOpen(true)}>
              참여자 추가
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Select
          value={assessmentId}
          onChange={(v) => {
            setAssessmentId(v);
            setPage(1);
          }}
          options={["전체", ...ASSESSMENTS.map((a) => a.id)]}
        />
        <Select
          value={department}
          onChange={(v) => {
            setDepartment(v);
            setPage(1);
          }}
          options={["전체", ...DEPARTMENTS]}
        />
        <div className="sm:col-span-2">
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="참여자 이름 검색"
          />
        </div>
      </div>

      <Card padded={false}>
        <div className="px-5 pt-5">
          <Table head={["이름", "사업장", "PIN", "상태", "초대일", "액션"]} minWidth={640}>
            {paged.map((p) => (
              <Row key={p.id} onClick={() => setDetail(p)}>
                <Cell strong>
                  {p.name}
                  <span className="mt-0.5 block text-[11.5px] font-normal text-[var(--gi-mute)]">
                    {p.department} / {p.rank}
                  </span>
                </Cell>
                <Cell muted>{p.unit}</Cell>
                <Cell mono>{p.pin}</Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
                </Cell>
                <Cell muted mono nowrap>
                  {p.invitedAt ?? "-"}
                </Cell>
                <Cell align="right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      aria-label="PIN 재발급"
                      onClick={(e) => {
                        e.stopPropagation();
                        reissuePin(p.id);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[var(--gi-hairline)] text-[var(--gi-body)] hover:bg-[var(--gi-soft)]"
                    >
                      <ArrowsClockwise size={12} />
                    </button>
                    <button
                      type="button"
                      aria-label="초대 메일 발송"
                      onClick={(e) => {
                        e.stopPropagation();
                        resend(p.id);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[var(--gi-hairline)] text-[var(--gi-body)] hover:bg-[var(--gi-soft)]"
                    >
                      <PaperPlaneTilt size={12} />
                    </button>
                  </div>
                </Cell>
              </Row>
            ))}
          </Table>
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
        <div className="pb-5" />
      </Card>

      <Drawer open={detail !== null} title={detail?.name ?? ""} subtitle={detail ? `${detail.department} / ${detail.rank} / ${detail.unit}` : undefined} onClose={() => setDetail(null)}>
        {detail && (
          <div className="space-y-5">
            <DefList
              columns={1}
              items={[
                { label: "이메일", value: detail.email },
                { label: "휴대폰", value: <span className="gi-mono">{detail.phone}</span> },
                { label: "PIN", value: <span className="gi-mono">{detail.pin}</span> },
                { label: "상태", value: <Badge tone={STATUS_TONE[detail.status]}>{detail.status}</Badge> },
                { label: "초대일", value: detail.invitedAt ?? "-" },
                { label: "응답일", value: detail.respondedAt ?? "-" },
              ]}
            />
            <div className="flex gap-2">
              <Button variant="secondary" full icon={<ArrowsClockwise size={14} />} onClick={() => reissuePin(detail.id)}>
                PIN 재발급
              </Button>
              <Button full icon={<PaperPlaneTilt size={14} />} onClick={() => resend(detail.id)}>
                초대 메일 재발송
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer open={addOpen} title="참여자 추가" subtitle="개별 참여자를 등록합니다" onClose={() => setAddOpen(false)}>
        <div className="space-y-5">
          <Field label="이름" required>
            <Input value={draftName} onChange={setDraftName} placeholder="예: 김도윤" />
          </Field>
          <p className="text-[12px] leading-5 text-[var(--gi-mute)]">
            부서, 직급, 사업장은 등록 후 상세 정보에서 수정할 수 있습니다. PIN은 자동으로 생성됩니다.
          </p>
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="secondary" full onClick={() => setAddOpen(false)}>
            취소
          </Button>
          <Button full onClick={addParticipant}>
            추가하기
          </Button>
        </div>
      </Drawer>

      <Drawer open={uploadOpen} title="Excel 일괄 등록" subtitle="참여자 명단 파일을 업로드하세요" onClose={() => setUploadOpen(false)}>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-[var(--gi-hairline-strong)] bg-[var(--gi-soft)] px-6 py-10 text-center">
            <UploadSimple size={22} className="text-[var(--gi-mute)]" />
            <p className="text-[13px] text-[var(--gi-body)]">
              이름, 부서, 직급, 사업장, 이메일 컬럼을 포함한 .xlsx 파일을 끌어다 놓으세요
            </p>
            <Button size="sm" variant="secondary" onClick={() => setUploaded(true)}>
              파일 선택 (데모)
            </Button>
          </div>
          {uploaded && (
            <div className="gi-enter rounded-[6px] border border-[var(--gi-info-soft)] bg-[var(--gi-info-soft)] px-3 py-2.5 text-[12.5px] text-[var(--gi-info-deep)]">
              participants_2026Q1.xlsx 업로드 완료, 28명 인식됨(중복 2건 제외)
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="secondary" full onClick={() => setUploadOpen(false)}>
            취소
          </Button>
          <Button full disabled={!uploaded} onClick={() => setUploadOpen(false)}>
            등록하기
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
