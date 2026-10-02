"use client";

import Image from "next/image";
import {
  CaretLeft,
  ChatCircle,
  Heart,
  MapPin,
  Ruler,
  SealCheck,
  ShieldCheck,
  Ticket,
  Warning,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  DefList,
  Eyebrow,
  SectionTitle,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import { PriceCompare } from "@/projects/commerce/baseballmarket/components/listing-card";
import { ListingRow } from "@/projects/commerce/baseballmarket/components/listing-card";
import {
  KRW,
  LISTINGS,
  overFace,
  overFaceRatio,
  photo,
  seller,
  team,
  teamLabel,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { Listing } from "@/projects/commerce/baseballmarket/lib/types";

/* 상세. 유니폼이면 실측과 정품 여부가, 티켓이면 정가 비교와 양도 방식이 본문 상단에 온다.
   spec Key Focus 3번대로 채팅 → 가격 제안 → 안전거래 결제로 이어지는 동선을 한 화면에서 보여준다. */

export function DetailScreen({
  listing,
  onBack,
  onOpenListing,
  onOpenChat,
  liked,
  onToggleLike,
}: {
  listing: Listing;
  onBack: () => void;
  onOpenListing: (id: string) => void;
  onOpenChat: () => void;
  liked: boolean;
  onToggleLike: () => void;
}) {
  const s = seller(listing.sellerId);
  const isTicket = listing.category === "티켓";
  const over = overFace(listing);
  const ratio = overFaceRatio(listing);
  const related = LISTINGS.filter(
    (l) => l.id !== listing.id && l.category === listing.category,
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8 lg:py-12">
      <button
        type="button"
        onClick={onBack}
        className="bm-press mb-6 inline-flex items-center gap-1.5 rounded-[6px] py-1.5 pr-3 text-[14px] font-semibold text-[var(--bm-muted)]"
      >
        <CaretLeft size={15} weight="bold" />
        매물 목록
      </button>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* 좌: 사진 + 설명 */}
        <div className="bm-rise lg:col-span-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[var(--bm-surface-strong)]">
            <Image
              src={photo(listing.photoId, 1000, 750)}
              alt={listing.title}
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`relative block aspect-square overflow-hidden rounded-[8px] bg-[var(--bm-surface-strong)] ${
                  i === 0 ? "ring-2 ring-[var(--bm-ink)] ring-offset-2 ring-offset-[var(--bm-canvas)]" : ""
                }`}
              >
                <Image
                  src={photo(listing.photoId, 200, 200)}
                  alt={`${listing.title} 사진 ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  style={{ objectPosition: ["center", "top", "bottom", "left"][i] }}
                  unoptimized
                />
              </span>
            ))}
          </div>

          <div className="mt-10">
            <SectionTitle title="상세 설명" />
            <p className="text-[16px] leading-[25px] text-[var(--bm-body)]">{listing.desc}</p>

            {listing.uniform && (
              <>
                <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                  <Card tone="card">
                    <p className="flex items-center gap-2 text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                      <Ruler size={15} />
                      실측 사이즈
                    </p>
                    <dl className="mt-3.5 grid grid-cols-3 gap-3">
                      {[
                        { k: "가슴", v: listing.uniform.chest },
                        { k: "총장", v: listing.uniform.length },
                        { k: "어깨", v: listing.uniform.shoulder },
                      ].map((m) => (
                        <div key={m.k}>
                          <dt className="text-[12px] leading-[17px] text-[var(--bm-muted)]">{m.k}</dt>
                          <dd className="bm-num mt-1 text-[20px] font-medium leading-[26px] text-[var(--bm-ink)]">
                            {m.v}
                            <span className="ml-0.5 text-[13px] font-medium text-[var(--bm-muted)]">cm</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 text-[12px] leading-[18px] text-[var(--bm-muted)]">
                      표기 사이즈 {listing.uniform.size} 기준, 판매자 직접 실측
                    </p>
                  </Card>

                  <Card tone="card">
                    <p className="flex items-center gap-2 text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                      <SealCheck size={15} />
                      정품 및 상태
                    </p>
                    <div className="mt-3.5 space-y-2.5">
                      <Badge tone={listing.uniform.authentic ? "success" : "warning"}>
                        {listing.uniform.authentic ? "정품 어센틱" : "정품 확인 불가"}
                      </Badge>
                      <p className="text-[13px] leading-[20px] text-[var(--bm-body)]">
                        구매 시기 {listing.uniform.season}년 시즌 | 상태 등급 {listing.condition}
                      </p>
                      {listing.uniform.flaws.length > 0 ? (
                        <ul className="space-y-1.5">
                          {listing.uniform.flaws.map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-2 text-[13px] leading-[20px] text-[var(--bm-error-deep)]"
                            >
                              <Warning size={13} weight="fill" className="mt-1 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[13px] leading-[20px] text-[var(--bm-link-deep)]">표기할 하자 없음</p>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="mt-2.5">
                  <Card tone="soft">
                    <DefList
                      rows={[
                        { label: "구단", value: teamLabel(listing.team) },
                        { label: "시즌 / 종류", value: `${listing.uniform.season} ${listing.uniform.kind}` },
                        {
                          label: "선수 / 등번호",
                          value:
                            listing.uniform.player === "미마킹"
                              ? "미마킹"
                              : `${listing.uniform.player} ${listing.uniform.backNumber}번`,
                        },
                        { label: "사이즈", value: listing.uniform.size },
                      ]}
                    />
                  </Card>
                </div>
              </>
            )}

            {listing.ticket && (
              <div className="mt-8 space-y-2.5">
                <Card tone="card">
                  <p className="flex items-center gap-2 text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                    <Ticket size={15} />
                    경기 및 좌석
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] leading-[17px] text-[var(--bm-muted)]">홈</p>
                      <p className="truncate text-[17px] font-semibold leading-[24px] text-[var(--bm-ink)]">
                        {team(listing.ticket.homeTeam).name}
                      </p>
                    </div>
                    <span className="text-[13px] font-medium text-[var(--bm-muted)]">vs</span>
                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-[12px] leading-[17px] text-[var(--bm-muted)]">원정</p>
                      <p className="truncate text-[17px] font-semibold leading-[24px] text-[var(--bm-ink)]">
                        {team(listing.ticket.awayTeam).name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-[var(--bm-hairline)] pt-4">
                    <DefList
                      rows={[
                        {
                          label: "일시",
                          value: (
                            <span className="bm-num">
                              {listing.ticket.gameDate.replace(/-/g, ".")} {listing.ticket.gameTime}
                            </span>
                          ),
                        },
                        { label: "구장", value: listing.ticket.stadium },
                        {
                          label: "좌석",
                          value: `${listing.ticket.zone} ${listing.ticket.row} ${listing.ticket.seats}매`,
                        },
                        { label: "양도 방식", value: listing.ticket.transfer },
                      ]}
                    />
                  </div>
                </Card>

                <Card tone={over > 0 ? "canvas" : "soft"}>
                  <p className="text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                    정가 대비 판매가
                  </p>
                  <div className="mt-4 space-y-2.5">
                    <PriceBar label="좌석 정가" value={listing.facePrice ?? 0} max={Math.max(listing.price, listing.facePrice ?? 0)} tone="neutral" />
                    <PriceBar label="판매가" value={listing.price} max={Math.max(listing.price, listing.facePrice ?? 0)} tone={ratio > 10 ? "danger" : "success"} />
                  </div>
                  {ratio > 10 ? (
                    <div className="mt-4 flex items-start gap-2.5 rounded-[8px] bg-[var(--bm-error-soft)] p-3.5">
                      <Warning size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--bm-error-deep)]" />
                      <p className="text-[13px] leading-[20px] text-[var(--bm-error-deep)]">
                        정가보다 <span className="bm-num font-semibold">{KRW(over)}</span> 높습니다
                        (+{ratio}%). 정가 기준표 대비 10퍼센트를 넘는 매물은 자동 탐지 목록에 오르며
                        운영팀 검토 후 노출이 중단될 수 있습니다.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-start gap-2.5 rounded-[8px] bg-[var(--bm-success-soft)] p-3.5">
                      <ShieldCheck size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--bm-link-deep)]" />
                      <p className="text-[13px] leading-[20px] text-[var(--bm-link-deep)]">
                        정가 기준표 범위 안입니다. 예매 수수료를 포함한 정상 양도가로 확인됩니다.
                      </p>
                    </div>
                  )}
                  <p className="mt-3 text-[12px] leading-[18px] text-[var(--bm-muted)]">
                    기준표 버전 v4.2 | {listing.ticket.stadium} {listing.ticket.zone} 주말 기준
                  </p>
                </Card>

                <Card tone="soft">
                  <p className="text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                    취소 및 환불 정책
                  </p>
                  <ul className="mt-3 space-y-2 text-[13px] leading-[20px] text-[var(--bm-body)]">
                    <li>경기 3일 전까지 전액 환불, 이후에는 양도 완료 여부에 따라 조정합니다.</li>
                    <li>우천 취소 시 예매처 환불 규정을 따르며 수수료는 판매자가 부담합니다.</li>
                    <li>양도 미이행이 확인되면 안전거래 결제금은 전액 구매자에게 돌아갑니다.</li>
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* 우: 가격, 판매자, 거래 */}
        <div className="lg:col-span-5">
          <div className="bm-rise lg:sticky lg:top-24" style={{ animationDelay: "70ms" }}>
            <Eyebrow>{listing.category}</Eyebrow>
            <h1 className="mt-3 text-[26px] font-semibold leading-[34px] tracking-[-0.02em] text-[var(--bm-ink)]">
              {listing.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5">
                <TeamMark id={listing.team} size={22} />
                <span className="text-[13px] font-medium text-[var(--bm-body)]">
                  {teamLabel(listing.team)}
                </span>
              </span>
              <Badge tone="neutral">{listing.condition}</Badge>
              {listing.status === "예약중" && <Badge tone="ink">예약중</Badge>}
              {listing.method.includes("안전거래") && <Badge tone="success">안전거래</Badge>}
            </div>

            <p className="bm-num mt-5 text-[34px] font-medium leading-[40px] tracking-[-0.02em] text-[var(--bm-ink)]">
              {KRW(listing.price)}
            </p>
            {isTicket && (
              <div className="mt-2.5">
                <PriceCompare listing={listing} />
              </div>
            )}
            {listing.negotiable && (
              <p className="mt-2 text-[13px] leading-[20px] text-[var(--bm-muted)]">
                가격 제안을 받고 있습니다
              </p>
            )}

            <div className="mt-6 flex items-center gap-3 text-[13px] leading-[20px] text-[var(--bm-muted)]">
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} />
                {listing.dong}
              </span>
              <span className="text-[var(--bm-hairline-strong)]">|</span>
              <span className="bm-num">찜 {listing.likes}</span>
              <span className="bm-num">채팅 {listing.chats}</span>
            </div>

            {/* 판매자 신뢰 정보 */}
            <div className="mt-6 rounded-[12px] bg-[var(--bm-surface-card)] p-5">
              <div className="flex items-center gap-3">
                <TeamMark id={s.homeTeam} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold leading-[21px] text-[var(--bm-ink)]">
                    {s.nickname}
                  </p>
                  <p className="truncate text-[13px] leading-[19px] text-[var(--bm-muted)]">
                    {s.dong} | 가입 {s.joinedAt}
                  </p>
                </div>
                <div className="text-right">
                  <p className="bm-num text-[20px] font-medium leading-[26px] text-[var(--bm-ink)]">
                    {s.mannerScore}
                  </p>
                  <p className="text-[12px] leading-[17px] text-[var(--bm-muted)]">매너 점수</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--bm-hairline)] pt-4">
                {[
                  { k: "거래", v: `${s.tradeCount}회` },
                  { k: "응답률", v: `${s.responseRate}%` },
                  { k: "평균 응답", v: `${s.responseMin}분` },
                ].map((m) => (
                  <div key={m.k}>
                    <p className="text-[12px] leading-[17px] text-[var(--bm-muted)]">{m.k}</p>
                    <p className="bm-num mt-0.5 text-[14px] font-semibold leading-[20px] text-[var(--bm-body-strong)]">
                      {m.v}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-[var(--bm-hairline)] pt-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--bm-muted)]">
                  거래 후기
                </p>
                <p className="text-[13px] leading-[20px] text-[var(--bm-body)]">
                  실측 그대로였고 포장도 꼼꼼했습니다. 다음에 또 거래하고 싶어요.
                </p>
                <p className="text-[12px] leading-[17px] text-[var(--bm-muted-soft)]">
                  외야석주민 | 2주 전
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <Button full size="lg" onClick={onOpenChat}>
                안전거래로 구매하기
              </Button>
              <div className="grid grid-cols-2 gap-2.5">
                <Button variant="secondary" full onClick={onOpenChat}>
                  <span className="inline-flex items-center gap-1.5">
                    <ChatCircle size={15} />
                    채팅 문의
                  </span>
                </Button>
                <Button variant="secondary" full onClick={onToggleLike}>
                  <span className="inline-flex items-center gap-1.5">
                    <Heart size={15} weight={liked ? "fill" : "regular"} />
                    {liked ? "찜 해제" : "찜하기"}
                  </span>
                </Button>
              </div>
              {listing.method.includes("직거래") && (
                <p className="text-center text-[13px] leading-[20px] text-[var(--bm-muted)]">
                  직거래 희망 지역 {listing.dong} 인근
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <SectionTitle title="함께 본 매물" />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {related.map((l) => (
            <div key={l.id} className="rounded-[12px] bg-[var(--bm-surface-card)] p-4">
              <ListingRow listing={l} onOpen={() => onOpenListing(l.id)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PriceBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "neutral" | "success" | "danger";
}) {
  const colors = {
    neutral: "var(--bm-hairline-strong)",
    success: "var(--bm-success)",
    danger: "var(--bm-error)",
  };
  return (
    <div className="flex items-center gap-3">
      <span className="w-[64px] shrink-0 text-[13px] leading-[18px] text-[var(--bm-muted)]">
        {label}
      </span>
      <span className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--bm-surface-strong)]">
        <span
          className="block h-full rounded-full"
          style={{ width: `${Math.round((value / max) * 100)}%`, background: colors[tone] }}
        />
      </span>
      <span className="bm-num w-[76px] shrink-0 text-right text-[13px] font-semibold leading-[18px] text-[var(--bm-ink)]">
        {KRW(value)}
      </span>
    </div>
  );
}
