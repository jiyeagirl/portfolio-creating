"use client";

import { useMemo, useState } from "react";
import { Megaphone, Plus, Tag, X } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  Field,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Table,
  Tabs,
  ThumbCell,
} from "@/projects/community/enclave/components/admin/admin-ui";
import { ADMIN_COMPLEXES, ADMIN_POSTS, NOTICES } from "@/projects/community/enclave/lib/mock-data";
import type { AdminComplex, AdminPost } from "@/projects/community/enclave/lib/types";

const PER_PAGE = 8;
const POST_FILTERS: (AdminPost["status"] | "전체")[] = ["전체", "판매중", "예약중", "거래완료", "신고접수", "숨김처리"];
const DEFAULT_CATEGORIES = ["전자기기", "가구/인테리어", "패션/잡화", "취미/악기", "생활가전", "스포츠/레저"];

function postStatusTone(status: AdminPost["status"]) {
  if (status === "판매중") return "accent" as const;
  if (status === "예약중") return "warn" as const;
  if (status === "신고접수") return "danger" as const;
  return "neutral" as const;
}

function complexStatusTone(status: AdminComplex["verifyStatus"]) {
  if (status === "승인완료") return "accent" as const;
  if (status === "승인대기") return "warn" as const;
  return "danger" as const;
}

export function ComplexesPostsScreen() {
  const [section, setSection] = useState<"단지 관리" | "게시글 관리">("단지 관리");

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="Complexes & Posts"
        title="단지 / 게시글 관리"
        desc="단지 인증 승인 운영과 게시글 검수를 담당합니다. Enclave의 핵심 차별점인 단지 기반 신뢰 운영이 이루어지는 화면입니다."
      />
      <Tabs
        value={section}
        onChange={setSection}
        items={[
          { key: "단지 관리", label: "단지 관리", count: ADMIN_COMPLEXES.filter((c) => c.verifyStatus === "승인대기").length },
          { key: "게시글 관리", label: "게시글 관리" },
        ]}
      />
      {section === "단지 관리" ? <ComplexesPanel /> : <PostsPanel />}
    </div>
  );
}

function ComplexesPanel() {
  const [complexes, setComplexes] = useState(ADMIN_COMPLEXES);
  const [active, setActive] = useState<AdminComplex | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [households, setHouseholds] = useState("");
  const [lockers, setLockers] = useState("");

  function setStatus(id: string, status: AdminComplex["verifyStatus"]) {
    setComplexes((prev) => prev.map((c) => (c.id === id ? { ...c, verifyStatus: status } : c)));
    setActive(null);
  }

  function submitRegister() {
    if (!name.trim() || !address.trim()) return;
    setComplexes((prev) => [
      {
        id: `cx-new-${prev.length + 1}`,
        name: name.trim(),
        address: address.trim(),
        householdCount: Number(households) || 0,
        residentCount: 0,
        verifyStatus: "승인대기",
        requestedAt: "2025.06.13",
        lockerCount: Number(lockers) || 0,
      },
      ...prev,
    ]);
    setName("");
    setAddress("");
    setHouseholds("");
    setLockers("");
    setRegisterOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setRegisterOpen(true)}>
          <Plus size={14} />
          단지 등록
        </Button>
      </div>

      <Card padded={false} className="p-5">
        <Table head={["단지명", "주소", "세대수", "인증회원", "무인택배함", "신청일", "인증상태"]} minWidth={800}>
          {complexes.map((c) => (
            <Row key={c.id} onClick={() => setActive(c)}>
              <Cell strong>{c.name}</Cell>
              <Cell muted>{c.address}</Cell>
              <Cell mono align="right">{c.householdCount.toLocaleString("ko-KR")}</Cell>
              <Cell mono align="right">{c.residentCount.toLocaleString("ko-KR")}</Cell>
              <Cell mono align="right">{c.lockerCount}</Cell>
              <Cell mono muted nowrap>{c.requestedAt}</Cell>
              <Cell align="center">
                <Badge tone={complexStatusTone(c.verifyStatus)}>{c.verifyStatus}</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.name ?? ""}
        subtitle={active?.address}
        footer={
          active &&
          active.verifyStatus === "승인대기" && (
            <div className="flex items-center justify-end gap-2">
              <Button variant="danger" onClick={() => setStatus(active.id, "반려")}>반려</Button>
              <Button onClick={() => setStatus(active.id, "승인완료")}>승인</Button>
            </div>
          )
        }
      >
        {active && (
          <DefList
            items={[
              { label: "인증 상태", value: <Badge tone={complexStatusTone(active.verifyStatus)}>{active.verifyStatus}</Badge> },
              { label: "세대수", value: `${active.householdCount.toLocaleString("ko-KR")}세대` },
              { label: "인증 완료 회원", value: `${active.residentCount.toLocaleString("ko-KR")}명` },
              { label: "무인택배함", value: `${active.lockerCount}개` },
              { label: "신청일", value: active.requestedAt },
            ]}
          />
        )}
      </Drawer>

      <Drawer
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        title="새 단지 등록"
        subtitle="관리사무소 확인서 접수 후 승인대기 상태로 등록됩니다"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setRegisterOpen(false)}>취소</Button>
            <Button onClick={submitRegister} disabled={!name.trim() || !address.trim()}>등록 신청</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="단지명">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 센트럴포레 1차"
              className="h-10 w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 text-[14px] text-[var(--ec-ink)] outline-none focus:border-[var(--ec-border-strong)]"
            />
          </Field>
          <Field label="주소">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: 서울 은평구 갈현동 512"
              className="h-10 w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 text-[14px] text-[var(--ec-ink)] outline-none focus:border-[var(--ec-border-strong)]"
            />
          </Field>
          <Field label="세대수">
            <input
              value={households}
              onChange={(e) => setHouseholds(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="예: 1200"
              className="h-10 w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 tabular-nums text-[14px] text-[var(--ec-ink)] outline-none focus:border-[var(--ec-border-strong)]"
            />
          </Field>
          <Field label="무인택배함 개수" hint="설치 완료된 보관함 수를 입력하세요">
            <input
              value={lockers}
              onChange={(e) => setLockers(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="예: 12"
              className="h-10 w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 tabular-nums text-[14px] text-[var(--ec-ink)] outline-none focus:border-[var(--ec-border-strong)]"
            />
          </Field>
        </div>
      </Drawer>
    </div>
  );
}

function PostsPanel() {
  const [posts, setPosts] = useState(ADMIN_POSTS);
  const [tab, setTab] = useState<AdminPost["status"] | "전체">("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [notices, setNotices] = useState(NOTICES);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");

  const filtered = useMemo(
    () => posts.filter((p) => (tab === "전체" ? true : p.status === tab)).filter((p) => (query ? p.title.includes(query) : true)),
    [tab, query, posts],
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function hide(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "숨김처리" } : p)));
  }

  function addCategory() {
    if (!newCategory.trim() || categories.includes(newCategory.trim())) return;
    setCategories((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
  }

  function removeCategory(cat: string) {
    setCategories((prev) => prev.filter((c) => c !== cat));
  }

  function submitNotice() {
    if (!noticeTitle.trim() || !noticeBody.trim()) return;
    setNotices((prev) => [
      { id: `notice-${prev.length + 1}`, title: noticeTitle.trim(), body: noticeBody.trim(), publishedAt: "2025.06.13", pinned: false },
      ...prev,
    ]);
    setNoticeTitle("");
    setNoticeBody("");
    setNoticeOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <Tabs
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
          items={POST_FILTERS.map((f) => ({ key: f, label: f, count: f === "전체" ? posts.length : posts.filter((p) => p.status === f).length }))}
        />

        <div className="max-w-[320px]">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="상품명 검색" />
        </div>

        <Card padded={false} className="p-5">
          <Table
            head={["상품", "판매자", "단지", "가격", "상태", "신고수", "등록일", ""]}
            minWidth={880}
            align={["left", "left", "left", "right", "center", "right", "left", "right"]}
          >
            {paged.map((p) => (
              <Row key={p.id}>
                <Cell><ThumbCell photoId={p.photoId} title={p.title} /></Cell>
                <Cell muted>{p.sellerNickname}</Cell>
                <Cell muted>{p.complexName}</Cell>
                <Cell mono align="right">{p.price.toLocaleString("ko-KR")}원</Cell>
                <Cell align="center"><Badge tone={postStatusTone(p.status)}>{p.status}</Badge></Cell>
                <Cell mono align="right" muted={p.reportCount === 0}>{p.reportCount}</Cell>
                <Cell mono muted nowrap>{p.postedAt}</Cell>
                <Cell align="right">
                  {p.status !== "숨김처리" && (
                    <Button variant="danger" size="sm" onClick={() => hide(p.id)}>
                      숨김처리
                    </Button>
                  )}
                </Cell>
              </Row>
            ))}
          </Table>
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHead title="카테고리 관리" desc="상품 등록 화면에 노출되는 카테고리 목록입니다" />
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ec-surface-soft)] px-3 py-1.5 text-[13px] text-[var(--ec-body)]"
              >
                <Tag size={12} />
                {c}
                <button type="button" aria-label={`${c} 삭제`} onClick={() => removeCategory(c)} className="text-[var(--ec-muted)]">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="새 카테고리명"
              className="h-9 flex-1 rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 text-[13.5px] text-[var(--ec-ink)] outline-none focus:border-[var(--ec-border-strong)]"
            />
            <Button size="sm" onClick={addCategory} disabled={!newCategory.trim()}>추가</Button>
          </div>
        </Card>

        <Card>
          <CardHead
            title="공지사항"
            desc="사용자 앱 공지 화면에 노출됩니다"
            action={
              <Button size="sm" onClick={() => setNoticeOpen(true)}>
                <Megaphone size={13} />
                공지 등록
              </Button>
            }
          />
          <ul className="space-y-2.5">
            {notices.slice(0, 4).map((n) => (
              <li key={n.id} className="flex items-start justify-between gap-3 border-b border-[var(--ec-border)] pb-2.5 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {n.pinned && <Badge tone="accent">고정</Badge>}
                    <p className="truncate text-[13.5px] font-medium text-[var(--ec-ink)]">{n.title}</p>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[12px] text-[var(--ec-muted)]">{n.body}</p>
                </div>
                <span className="ec-mono shrink-0 text-[11.5px] text-[var(--ec-muted)]">{n.publishedAt}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Drawer
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        title="공지사항 등록"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setNoticeOpen(false)}>취소</Button>
            <Button onClick={submitNotice} disabled={!noticeTitle.trim() || !noticeBody.trim()}>등록</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="제목">
            <input
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="공지 제목을 입력하세요"
              className="h-10 w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 text-[14px] text-[var(--ec-ink)] outline-none focus:border-[var(--ec-border-strong)]"
            />
          </Field>
          <Field label="내용">
            <textarea
              value={noticeBody}
              onChange={(e) => setNoticeBody(e.target.value)}
              rows={5}
              placeholder="공지 내용을 입력하세요"
              className="w-full rounded-[6px] border border-[var(--ec-border)] bg-[var(--ec-surface)] px-3 py-2 text-[13.5px] leading-5 text-[var(--ec-ink)] outline-none focus:border-[var(--ec-border-strong)]"
            />
          </Field>
        </div>
      </Drawer>
    </div>
  );
}
