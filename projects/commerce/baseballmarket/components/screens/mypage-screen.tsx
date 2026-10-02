"use client";

import { useState } from "react";
import { Bank, Star } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  DefList,
  EmptyState,
  Eyebrow,
  Field,
  Input,
  SectionTitle,
  Select,
  Tabs,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import { ListingRow } from "@/projects/commerce/baseballmarket/components/listing-card";
import { Toggle } from "@/components/shared/toggle";
import {
  KRW,
  LISTINGS,
  ME,
  POSTS,
  TEAMS,
  teamLabel,
} from "@/projects/commerce/baseballmarket/lib/mock-data";

type Tab = "selling" | "bought" | "liked" | "posts" | "reviews" | "settings";

const REVIEWS = [
  { id: "rv1", from: "외야석주민", score: 5, body: "실측 그대로였고 포장도 꼼꼼했습니다.", at: "2주 전" },
  { id: "rv2", from: "마킹장인", score: 5, body: "약속 시간 정확하셨어요. 다음에 또 거래하고 싶습니다.", at: "1개월 전" },
  { id: "rv3", from: "직관메이트", score: 4, body: "상태 설명이 조금 더 자세했으면 좋았겠습니다.", at: "2개월 전" },
];

export function MypageScreen({
  onOpenListing,
  onLogout,
  liked,
}: {
  onOpenListing: (id: string) => void;
  onLogout: () => void;
  liked: Set<string>;
}) {
  const [tab, setTab] = useState<Tab>("selling");
  const [teamId, setTeamId] = useState(ME.team);
  const [alarmDeal, setAlarmDeal] = useState(true);
  const [alarmChat, setAlarmChat] = useState(true);
  const [alarmCommunity, setAlarmCommunity] = useState(false);
  const [account, setAccount] = useState("21403-02-118374");

  const selling = LISTINGS.filter((l) => l.sellerId === "s1");
  const bought = LISTINGS.filter((l) => l.status === "거래완료");
  const likedList = LISTINGS.filter((l) => liked.has(l.id));
  const myPosts = POSTS.filter((p) => p.author === ME.nickname);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-8 lg:py-14">
      <Eyebrow>마이페이지</Eyebrow>

      <section className="bm-rise mt-4 flex flex-wrap items-center gap-5 rounded-[16px] bg-[var(--bm-surface)] p-6 lg:p-8">
        <TeamMark id={ME.team} size={64} accent />
        <div className="min-w-0 flex-1">
          <h1 className="text-[26px] font-medium leading-[34px] tracking-[-0.02em] text-[var(--bm-ink)]">
            {ME.nickname}
          </h1>
          <p className="mt-1 text-[14px] leading-[22px] text-[var(--bm-muted)]">
            {teamLabel(ME.team)} 팬 | {ME.dong} | 가입 {ME.joinedAt}
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="bm-num text-[24px] font-medium leading-[30px] text-[var(--bm-ink)]">
              {ME.mannerScore}
            </p>
            <p className="text-[12px] leading-[17px] text-[var(--bm-muted)]">매너 점수</p>
          </div>
          <div>
            <p className="bm-num text-[24px] font-medium leading-[30px] text-[var(--bm-ink)]">
              {ME.trades}
            </p>
            <p className="text-[12px] leading-[17px] text-[var(--bm-muted)]">거래 횟수</p>
          </div>
          <div>
            <p className="bm-num text-[24px] font-medium leading-[30px] text-[var(--bm-ink)]">
              {REVIEWS.length}
            </p>
            <p className="text-[12px] leading-[17px] text-[var(--bm-muted)]">받은 후기</p>
          </div>
        </div>
      </section>

      <div className="mt-9">
        <Tabs
          options={[
            { key: "selling" as Tab, label: "판매 내역", count: selling.length },
            { key: "bought" as Tab, label: "구매 내역", count: bought.length },
            { key: "liked" as Tab, label: "찜 목록", count: likedList.length },
            { key: "posts" as Tab, label: "내 글", count: myPosts.length },
            { key: "reviews" as Tab, label: "받은 후기", count: REVIEWS.length },
            { key: "settings" as Tab, label: "설정" },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-8">
        {tab === "selling" && (
          <div className="space-y-2.5">
            {selling.map((l) => (
              <Card key={l.id} tone="card" padded={false} className="p-4">
                <ListingRow
                  listing={l}
                  onOpen={() => onOpenListing(l.id)}
                  trailing={
                    <div className="flex items-center gap-2">
                      <Badge tone={l.status === "판매중" ? "success" : "neutral"}>{l.status}</Badge>
                      <Button size="sm" variant="secondary">
                        수정
                      </Button>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}

        {tab === "bought" && (
          <div className="space-y-2.5">
            {bought.map((l) => (
              <Card key={l.id} tone="card" padded={false} className="p-4">
                <ListingRow
                  listing={l}
                  onOpen={() => onOpenListing(l.id)}
                  trailing={
                    <Button size="sm" variant="secondary">
                      후기 작성
                    </Button>
                  }
                />
              </Card>
            ))}
          </div>
        )}

        {tab === "liked" &&
          (likedList.length === 0 ? (
            <EmptyState
              title="찜한 매물이 없습니다"
              desc="매물 카드의 하트를 누르면 여기에 모입니다. 가격이 내려가면 알림을 보내드립니다."
            />
          ) : (
            <div className="space-y-2.5">
              {likedList.map((l) => (
                <Card key={l.id} tone="card" padded={false} className="p-4">
                  <ListingRow listing={l} onOpen={() => onOpenListing(l.id)} />
                </Card>
              ))}
            </div>
          ))}

        {tab === "posts" &&
          (myPosts.length === 0 ? (
            <EmptyState title="작성한 글이 없습니다" desc="구단 게시판에 첫 글을 남겨보세요." />
          ) : (
            <div className="space-y-2.5">
              {myPosts.map((p) => (
                <Card key={p.id} tone="card">
                  <p className="text-[15px] font-semibold leading-[21px] text-[var(--bm-ink)]">
                    {p.title}
                  </p>
                  <p className="bm-num mt-1.5 text-[13px] leading-[19px] text-[var(--bm-muted)]">
                    {p.createdAt} | 좋아요 {p.likes} | 댓글 {p.comments}
                  </p>
                </Card>
              ))}
            </div>
          ))}

        {tab === "reviews" && (
          <div className="space-y-2.5">
            {REVIEWS.map((r) => (
              <Card key={r.id} tone="card">
                <div className="flex items-center gap-2">
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={13}
                        weight={i <= r.score ? "fill" : "regular"}
                        className={i <= r.score ? "text-[var(--bm-warning)]" : "text-[var(--bm-muted-soft)]"}
                      />
                    ))}
                  </span>
                  <span className="text-[13px] font-semibold text-[var(--bm-ink)]">{r.from}</span>
                  <span className="ml-auto text-[12px] text-[var(--bm-muted-soft)]">{r.at}</span>
                </div>
                <p className="mt-2.5 text-[14px] leading-[22px] text-[var(--bm-body)]">{r.body}</p>
              </Card>
            ))}
          </div>
        )}

        {tab === "settings" && (
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionTitle title="프로필" />
              <div className="space-y-4">
                <Field label="닉네임">
                  <Input value={ME.nickname} />
                </Field>
                <Field label="응원 구단" hint="구단을 바꾸면 홈 색과 커뮤니티 기본 게시판이 바뀝니다.">
                  <Select
                    value={teamId}
                    onChange={(v) => setTeamId(v as typeof teamId)}
                    options={TEAMS.map((t) => t.id)}
                  />
                </Field>
                <Field label="활동 지역">
                  <Input value={ME.dong} />
                </Field>
              </div>

              <div className="mt-10">
                <SectionTitle title="정산 계좌" />
                <Card tone="card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bm-surface-strong)] text-[var(--bm-body-strong)]">
                      <Bank size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                        A은행
                      </p>
                      <p className="bm-num truncate text-[13px] leading-[19px] text-[var(--bm-muted)]">
                        {account}
                      </p>
                    </div>
                    <Badge tone="success">인증완료</Badge>
                  </div>
                  <div className="mt-4">
                    <Input value={account} onChange={setAccount} placeholder="계좌번호" />
                  </div>
                  <div className="mt-4">
                    <DefList
                      rows={[
                        { label: "정산 대기", value: <span className="bm-num">{KRW(165000)}</span> },
                        { label: "이번 달 정산", value: <span className="bm-num">{KRW(412000)}</span> },
                      ]}
                    />
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <SectionTitle title="알림" />
              <Card tone="soft">
                <div className="space-y-4">
                  <SettingRow
                    label="관심 매물 알림"
                    desc="저장한 검색 조건에 맞는 매물이 올라오면"
                    checked={alarmDeal}
                    onChange={setAlarmDeal}
                  />
                  <SettingRow
                    label="채팅 알림"
                    desc="새 메시지와 가격 제안"
                    checked={alarmChat}
                    onChange={setAlarmChat}
                  />
                  <SettingRow
                    label="커뮤니티 알림"
                    desc="내 글의 댓글과 좋아요"
                    checked={alarmCommunity}
                    onChange={setAlarmCommunity}
                  />
                </div>
              </Card>

              <div className="mt-10">
                <SectionTitle title="계정" />
                <div className="space-y-2.5">
                  <Button variant="secondary" full>
                    비밀번호 변경
                  </Button>
                  <Button variant="secondary" full onClick={onLogout}>
                    로그아웃
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">{label}</p>
        <p className="mt-0.5 text-[13px] leading-[19px] text-[var(--bm-muted)]">{desc}</p>
      </div>
      <Toggle
        checked={checked}
        onChange={onChange}
        label={label}
        onClassName="bg-[var(--bm-ink)]"
        offClassName="bg-[var(--bm-surface-strong)]"
      />
    </div>
  );
}
