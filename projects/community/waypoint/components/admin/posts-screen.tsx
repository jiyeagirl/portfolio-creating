"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, Cell, PageHead, Pagination, Row, SearchInput, Table, Tabs, ThumbCell } from "@/projects/community/waypoint/components/admin/admin-ui";
import { ADMIN_POSTS } from "@/projects/community/waypoint/lib/mock-data";
import type { AdminPost } from "@/projects/community/waypoint/lib/types";

const PER_PAGE = 8;
const FILTERS: (AdminPost["status"] | "전체")[] = ["전체", "판매중", "예약중", "거래완료", "신고접수", "숨김처리"];

function statusTone(status: AdminPost["status"]) {
  if (status === "판매중") return "success" as const;
  if (status === "예약중") return "warn" as const;
  if (status === "신고접수") return "danger" as const;
  if (status === "숨김처리") return "neutral" as const;
  return "neutral" as const;
}

export function PostsScreen() {
  const [tab, setTab] = useState<AdminPost["status"] | "전체">("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(ADMIN_POSTS);

  const filtered = useMemo(
    () => posts.filter((p) => (tab === "전체" ? true : p.status === tab)).filter((p) => (query ? p.title.includes(query) : true)),
    [tab, query, posts],
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function hide(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "숨김처리" } : p)));
  }

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Posts" title="게시글 관리" desc="허위매물 숨김 처리와 신고 접수된 게시글을 검토합니다." />

      <Tabs
        value={tab}
        onChange={(v) => {
          setTab(v);
          setPage(1);
        }}
        items={FILTERS.map((f) => ({ key: f, label: f, count: f === "전체" ? posts.length : posts.filter((p) => p.status === f).length }))}
      />

      <div className="max-w-[320px]">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="상품명 검색" />
      </div>

      <Card padded={false} className="p-5">
        <Table head={["상품", "판매자", "가격", "상태", "신고수", "등록일", ""]} minWidth={760} align={["left", "left", "right", "center", "right", "left", "right"]}>
          {paged.map((p) => (
            <Row key={p.id}>
              <Cell><ThumbCell photoId={p.photoId} title={p.title} /></Cell>
              <Cell muted>{p.sellerNickname}</Cell>
              <Cell mono align="right">{p.price.toLocaleString("ko-KR")}원</Cell>
              <Cell align="center"><Badge tone={statusTone(p.status)}>{p.status}</Badge></Cell>
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
  );
}
