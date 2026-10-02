"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  ChatCircleDots,
  DotsThreeVertical,
  FileArrowDown,
  FilePdf,
  IdentificationCard,
  Image as ImageIcon,
  MagnifyingGlass,
  Paperclip,
  Prohibit,
  ReadCvLogo,
  SealCheck,
  Storefront,
  Warning,
} from "@phosphor-icons/react";
import {
  CHAT_ROOMS,
  CHAT_SITE_PHOTO,
  COMPANIES,
  MY_COMPANY,
  companyById,
  formatDate,
  formatRelativeTime,
  formatTime,
} from "@/projects/community/linkon/lib/mock-data";
import type { ChatMessage, ChatRoom } from "@/projects/community/linkon/lib/types";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  BrandMark,
  EmptyState,
  VerifiedBadge,
} from "@/projects/community/linkon/components/layout/ui";

export function ChatScreen({
  onNavigate,
  initialRoomCompanyId,
}: {
  onNavigate: NavigateFn;
  initialRoomCompanyId?: string;
}) {
  const [rooms, setRooms] = useState<ChatRoom[]>(() =>
    CHAT_ROOMS.map((room) => ({ ...room, messages: [...room.messages] })),
  );
  const initialRoom =
    rooms.find((room) => room.companyId === initialRoomCompanyId)?.id ?? rooms[0].id;
  const [activeId, setActiveId] = useState(initialRoom);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [threadSearch, setThreadSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(Boolean(initialRoomCompanyId));
  const counter = useRef(0);
  const threadRef = useRef<HTMLDivElement>(null);

  const active = rooms.find((room) => room.id === activeId)!;
  const activeCompany = companyById(active.companyId)!;

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rooms
      .filter((room) => {
        if (!q) return true;
        const company = companyById(room.companyId)!;
        return (
          company.name.toLowerCase().includes(q) ||
          room.messages.some((m) => m.text?.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  }, [rooms, query]);

  const visibleMessages = useMemo(() => {
    const q = threadSearch.trim().toLowerCase();
    if (!q) return active.messages;
    return active.messages.filter((m) => m.text?.toLowerCase().includes(q));
  }, [active.messages, threadSearch]);

  useEffect(() => {
    const node = threadRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [activeId, active.messages.length, threadSearch]);

  const push = (message: Omit<ChatMessage, "id" | "createdAt" | "from">) => {
    counter.current += 1;
    const next: ChatMessage = {
      ...message,
      id: `local-${counter.current}`,
      from: "me",
      createdAt: new Date("2026-07-27T12:05:00").toISOString(),
    };
    setRooms((prev) =>
      prev.map((room) =>
        room.id === activeId
          ? { ...room, messages: [...room.messages, next], lastAt: next.createdAt, unread: 0 }
          : room,
      ),
    );
    setAttachOpen(false);
  };

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    push({ kind: "text", text: draft.trim() });
    setDraft("");
  };

  const openRoom = (id: string) => {
    setActiveId(id);
    setThreadSearch("");
    setSearchOpen(false);
    setMenuOpen(false);
    setShowThreadOnMobile(true);
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, unread: 0 } : room)));
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8 lg:px-10">
      <h1 className="text-[28px] font-bold tracking-tight text-[var(--lk-ink)]">기업 채팅</h1>
      <p className="mt-2 text-[14px] text-[var(--lk-muted)]">
        인증 기업 간 1:1 대화입니다. 명함과 제안서를 바로 주고받을 수 있습니다.
      </p>

      <div className="mt-6 grid h-[calc(100dvh-230px)] min-h-[560px] grid-cols-1 overflow-hidden rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] lg:grid-cols-[320px_1fr]">
        <aside
          className={`flex min-h-0 flex-col border-[var(--lk-border)] lg:border-r ${
            showThreadOnMobile ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="border-b border-[var(--lk-border)] p-4">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-bg)] px-3 py-2">
              <MagnifyingGlass size={15} className="text-[var(--lk-muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="기업명, 대화 내용 검색"
                aria-label="채팅방 검색"
                className="w-full bg-transparent text-[13px] text-[var(--lk-ink)] outline-none"
              />
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<ChatCircleDots size={20} />}
                title="검색 결과가 없습니다"
                description="다른 기업명이나 대화 내용으로 검색해 보세요."
              />
            </div>
          ) : (
            <ul className="min-h-0 flex-1 divide-y divide-[var(--lk-border)] overflow-y-auto">
              {filteredRooms.map((room) => {
                const company = companyById(room.companyId)!;
                const last = room.messages[room.messages.length - 1];
                return (
                  <li key={room.id}>
                    <button
                      onClick={() => openRoom(room.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                        room.id === activeId ? "bg-[var(--lk-accent-soft)]/50" : "hover:bg-[var(--lk-surface)]"
                      }`}
                    >
                      <BrandMark logo={company.logo} size={40} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-[14px] font-bold text-[var(--lk-ink)]">
                            {company.name}
                          </span>
                          <SealCheck size={13} weight="fill" className="shrink-0 text-[var(--lk-accent)]" />
                          <span className="lk-num ml-auto shrink-0 text-[11.5px] text-[var(--lk-muted)]">
                            {formatRelativeTime(room.lastAt)}
                          </span>
                        </span>
                        <span className="mt-1 flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--lk-muted)]">
                            {last.kind === "proposal"
                              ? "프로젝트 제안서를 보냈습니다"
                              : last.kind === "file"
                                ? last.fileName
                                : last.kind === "namecard"
                                  ? "명함을 공유했습니다"
                                  : last.kind === "companyCard"
                                    ? "기업 소개 카드를 공유했습니다"
                                    : last.text}
                          </span>
                          {room.unread > 0 && (
                            <span className="lk-num flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--lk-danger)] px-1 text-[11px] font-bold text-white">
                              {room.unread}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className={`flex min-h-0 flex-col ${showThreadOnMobile ? "flex" : "hidden lg:flex"}`}>
          <header className="flex items-center gap-3 border-b border-[var(--lk-border)] px-5 py-3.5">
            <button
              onClick={() => setShowThreadOnMobile(false)}
              aria-label="채팅방 목록"
              className="text-[var(--lk-muted)] lg:hidden"
            >
              <ArrowLeft size={18} weight="bold" />
            </button>
            <BrandMark logo={activeCompany.logo} size={38} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-[15px] font-bold text-[var(--lk-ink)]">{activeCompany.name}</p>
                <VerifiedBadge />
              </div>
              <p className="truncate text-[12.5px] text-[var(--lk-muted)]">
                {activeCompany.manager.name} {activeCompany.manager.role} {activeCompany.industry}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchOpen((v) => !v);
                setThreadSearch("");
              }}
              aria-label="대화 검색"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--lk-muted)] transition-colors hover:bg-[var(--lk-surface)]"
            >
              <MagnifyingGlass size={17} />
            </button>
            <button
              onClick={() => onNavigate("companyDetail", activeCompany.id)}
              className="hidden rounded-full border border-[var(--lk-border)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--lk-ink)] transition-colors hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)] sm:block"
            >
              기업 프로필
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="더보기"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--lk-muted)] transition-colors hover:bg-[var(--lk-surface)]"
              >
                <DotsThreeVertical size={19} weight="bold" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-11 z-20 w-[176px] overflow-hidden rounded-xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] shadow-[var(--lk-shadow)]">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setNotice("신고가 접수되었습니다. 운영기관이 24시간 내 검토합니다.");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[var(--lk-ink)] hover:bg-[var(--lk-surface)]"
                  >
                    <Warning size={15} />
                    대화 신고
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setNotice("차단했습니다. 이 기업은 더 이상 메시지를 보낼 수 없습니다.");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[var(--lk-danger)] hover:bg-[var(--lk-surface)]"
                  >
                    <Prohibit size={15} />
                    기업 차단
                  </button>
                </div>
              )}
            </div>
          </header>

          {searchOpen && (
            <div className="border-b border-[var(--lk-border)] px-5 py-3">
              <input
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                placeholder="이 대화에서 검색"
                aria-label="대화 내용 검색"
                className="w-full rounded-lg border border-[var(--lk-border)] bg-[var(--lk-bg)] px-3.5 py-2 text-[13.5px] text-[var(--lk-ink)] outline-none"
              />
            </div>
          )}

          {notice && (
            <div className="flex items-center gap-2 border-b border-[var(--lk-border)] bg-[var(--lk-warning-soft)] px-5 py-2.5 text-[12.5px] font-semibold text-[var(--lk-warning)]">
              {notice}
              <button onClick={() => setNotice(null)} className="ml-auto underline">
                닫기
              </button>
            </div>
          )}

          <div
            ref={threadRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[var(--lk-bg)] px-5 py-6"
          >
            {visibleMessages.length === 0 ? (
              <EmptyState
                icon={<MagnifyingGlass size={20} />}
                title="검색 결과가 없습니다"
                description="다른 단어로 대화 내용을 검색해 보세요."
              />
            ) : (
              visibleMessages.map((message, index) => {
                const prev = visibleMessages[index - 1];
                const showDate =
                  !prev || formatDate(prev.createdAt) !== formatDate(message.createdAt);
                return (
                  <div key={message.id}>
                    {showDate && (
                      <p className="lk-num my-5 text-center text-[12px] font-semibold text-[var(--lk-muted)]">
                        {formatDate(message.createdAt)}
                      </p>
                    )}
                    <Bubble message={message} onNavigate={onNavigate} />
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={send} className="border-t border-[var(--lk-border)] p-4">
            {attachOpen && (
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <AttachButton
                  icon={<ImageIcon size={16} weight="fill" />}
                  label="이미지"
                  onClick={() =>
                    push({
                      kind: "image",
                      image: CHAT_SITE_PHOTO,
                      fileName: "실증현장_0727.jpg",
                      fileSize: "2.1MB",
                      text: "실증 현장 사진입니다.",
                    })
                  }
                />
                <AttachButton
                  icon={<FilePdf size={16} weight="fill" />}
                  label="파일"
                  onClick={() =>
                    push({
                      kind: "file",
                      fileName: "A테크_기술소개서_v4.pdf",
                      fileSize: "3.1MB",
                    })
                  }
                />
                <AttachButton
                  icon={<IdentificationCard size={16} weight="fill" />}
                  label="명함"
                  onClick={() =>
                    push({
                      kind: "namecard",
                      fileName: "A테크_정하윤_명함.pdf",
                      fileSize: "280KB",
                    })
                  }
                />
                <AttachButton
                  icon={<Storefront size={16} weight="fill" />}
                  label="기업 소개"
                  onClick={() => push({ kind: "companyCard", companyId: MY_COMPANY.id })}
                />
              </div>
            )}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setAttachOpen((v) => !v)}
                aria-label="첨부"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                  attachOpen
                    ? "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                    : "text-[var(--lk-muted)] hover:bg-[var(--lk-surface)]"
                }`}
              >
                <Paperclip size={19} />
              </button>
              <button
                type="button"
                onClick={() =>
                  push({
                    kind: "proposal",
                    proposal: {
                      title: "설비 데이터 라벨링 자동화 공동 연구",
                      budget: "4,500만원 (공동 부담)",
                      period: "2026.09 - 2027.01",
                    },
                    text: "논의된 범위로 제안서 초안을 보냅니다.",
                  })
                }
                className="hidden h-10 shrink-0 items-center gap-1.5 rounded-full border border-[var(--lk-border)] px-3.5 text-[13px] font-semibold text-[var(--lk-ink)] transition-colors hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)] sm:flex"
              >
                <ReadCvLogo size={15} />
                제안서
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={1}
                placeholder="메시지를 입력하세요"
                aria-label="메시지 입력"
                className="max-h-28 min-h-[40px] flex-1 resize-none rounded-lg border border-[var(--lk-border)] bg-[var(--lk-bg)] px-3.5 py-2.5 text-[14px] leading-relaxed text-[var(--lk-ink)] outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="전송"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--lk-accent)] text-[var(--lk-accent-fg)] transition-opacity disabled:opacity-35"
              >
                <ArrowUp size={18} weight="bold" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function AttachButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-bg)] px-3 py-2.5 text-[13px] font-semibold text-[var(--lk-ink)] transition-colors hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
    >
      <span className="text-[var(--lk-accent)]">{icon}</span>
      {label}
    </button>
  );
}

function Bubble({ message, onNavigate }: { message: ChatMessage; onNavigate: NavigateFn }) {
  const mine = message.from === "me";
  const card = message.companyId ? COMPANIES.find((c) => c.id === message.companyId) : undefined;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[min(520px,84%)] flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
        {message.kind === "text" && (
          <p
            className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
              mine
                ? "bg-[var(--lk-accent)] text-[var(--lk-accent-fg)]"
                : "border border-[var(--lk-border)] bg-[var(--lk-elevated)] text-[var(--lk-ink)]"
            }`}
          >
            {message.text}
          </p>
        )}

        {message.kind === "image" && message.image && (
          <div className="overflow-hidden rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)]">
            <img
              src={message.image}
              alt={message.text ?? "공유된 사진"}
              className="block h-[200px] w-[300px] object-cover"
            />
            {message.text && (
              <p className="px-4 py-2.5 text-[13.5px] text-[var(--lk-ink)]">{message.text}</p>
            )}
          </div>
        )}

        {(message.kind === "file" || message.kind === "namecard") && (
          <div className="w-[280px] rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]">
                {message.kind === "namecard" ? (
                  <IdentificationCard size={19} weight="fill" />
                ) : (
                  <FilePdf size={19} weight="fill" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                  {message.fileName}
                </span>
                <span className="lk-num block text-[12px] text-[var(--lk-muted)]">{message.fileSize}</span>
              </span>
              <FileArrowDown size={17} className="shrink-0 text-[var(--lk-muted)]" />
            </div>
            {message.text && (
              <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--lk-ink)]">{message.text}</p>
            )}
          </div>
        )}

        {message.kind === "companyCard" && card && (
          <button
            onClick={() => onNavigate("companyDetail", card.id)}
            className="w-[280px] rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-4 text-left transition-colors hover:border-[var(--lk-accent)]"
          >
            <div className="flex items-center gap-3">
              <BrandMark logo={card.logo} size={40} />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold text-[var(--lk-ink)]">{card.name}</p>
                <p className="truncate text-[12px] text-[var(--lk-muted)]">
                  {card.industry} {card.region}
                </p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-[var(--lk-muted)]">
              {card.oneLiner}
            </p>
            <p className="mt-3 text-[12.5px] font-semibold text-[var(--lk-accent)]">기업 프로필 보기</p>
          </button>
        )}

        {message.kind === "proposal" && message.proposal && (
          <div className="w-[300px] overflow-hidden rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)]">
            <div className="flex items-center gap-2 bg-[var(--lk-accent-soft)] px-4 py-2.5">
              <ReadCvLogo size={16} weight="fill" className="text-[var(--lk-accent)]" />
              <span className="text-[12.5px] font-bold text-[var(--lk-accent)]">프로젝트 제안서</span>
            </div>
            <div className="p-4">
              <p className="text-[14.5px] font-bold leading-snug text-[var(--lk-ink)]">
                {message.proposal.title}
              </p>
              <dl className="lk-num mt-3 space-y-1.5 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--lk-muted)]">예산</dt>
                  <dd className="font-semibold text-[var(--lk-ink)]">{message.proposal.budget}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--lk-muted)]">기간</dt>
                  <dd className="font-semibold text-[var(--lk-ink)]">{message.proposal.period}</dd>
                </div>
              </dl>
              {message.text && (
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--lk-muted)]">{message.text}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Badge tone="accent">검토 요청</Badge>
              </div>
            </div>
          </div>
        )}

        <span className="lk-num px-1 text-[11.5px] text-[var(--lk-muted)]">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
