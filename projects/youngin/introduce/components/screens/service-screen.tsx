"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CaretRight,
  CheckCircle,
  Clock,
  CurrencyKrw,
  Footprints,
  MapPin,
  Printer,
  Prohibit,
  SealCheck,
  Star,
  Ticket,
  Timer,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import {
  BUILDING,
  facilitiesOnFloor,
  facilityById,
  floorById,
  serviceById,
} from "../../lib/mock-data";
import type { Service } from "../../lib/types";
import type { NavigateFn } from "../../lib/navigation";
import { MiniFloorMap } from "../floor-map";
import { Badge, BottomSheet, Photo, PrimaryButton, SERVICE_ICON, SPRING, Stars } from "../ui";

/* 사진 id 1076: 아래에서 올려다본 각진 건물 코너. 처리 장소 카드에서 "어느 건물로
   가는지"를 보여주는 용도. design.md 사진 매핑 참고. */
const EXTERIOR_PHOTO = 1076;

type Flow = "idle" | "ticket" | "done";

function StatBox({
  icon: IconCmp,
  label,
  value,
  note,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex-1 px-2.5 py-3 text-center">
      <IconCmp size={17} weight="duotone" className="mx-auto text-[var(--yi-muted)]" />
      <p className="yi-num mt-1.5 text-[13.5px] font-bold leading-[18px] text-[var(--yi-ink)]">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] leading-[15px] text-[var(--yi-muted)]">{label}</p>
      {note && (
        <p className="yi-num mt-0.5 text-[10.5px] leading-[14px] text-[var(--yi-muted-soft)]">
          {note}
        </p>
      )}
    </div>
  );
}

export function ServiceScreen({
  serviceId,
  onNavigate,
  onSheetChange,
}: {
  serviceId: string;
  onNavigate: NavigateFn;
  /** Lets the shell flip the status bar to white while the scrim is up. */
  onSheetChange: (open: boolean) => void;
}) {
  const [flow, setFlow] = useState<Flow>("idle");
  const [sheetOpen, setSheetOpenState] = useState(false);
  const setSheetOpen = (open: boolean) => {
    setSheetOpenState(open);
    onSheetChange(open);
  };
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  /* `?service=` can carry an unknown id from the screenshot tool, so fall back
     to the most-used 민원 rather than rendering an empty screen. */
  const service = serviceById(serviceId) ?? (serviceById("resident-copy") as Service);
  const facility = facilityById(service.facilityId);
  const floor = floorById(service.floor);
  const related = service.related
    .map((id) => serviceById(id))
    .filter((s): s is Service => Boolean(s));
  const IconCmp = SERVICE_ICON[service.icon];

  const ticketCode = "A-042";
  const ticketAhead = facility?.queue ?? 3;

  return (
    <>
      <ScreenHeader
        title={service.name}
        subtitle={service.category}
        onBack={() => onNavigate("lobby")}
        className="yi-edge-bar border-[var(--yi-border)]"
        backButtonClassName="text-[var(--yi-ink)] active:bg-[var(--yi-surface-soft)]"
        titleClassName="text-[16px] font-semibold text-[var(--yi-ink)]"
        subtitleClassName="text-[11px] text-[var(--yi-muted)]"
      />

      <div className="flex-1 overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Issued ticket, once the visitor takes one */}
        {flow !== "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={SPRING}
            className="overflow-hidden"
          >
            <div className="m-5 mb-0 flex items-center gap-3.5 rounded-[16px] bg-[var(--yi-primary)] px-4 py-3.5">
              <div className="shrink-0 text-center">
                <p className="yi-num text-[22px] font-bold leading-7 tracking-[-0.02em] text-white">
                  {ticketCode}
                </p>
                <p className="text-[10px] font-semibold text-white/70">내 번호표</p>
              </div>
              <span className="h-9 w-px bg-white/25" />
              <div className="min-w-0 flex-1">
                {flow === "ticket" ? (
                  <>
                    <p className="yi-num text-[13.5px] font-semibold text-white">
                      앞에 {ticketAhead}명, 예상 {ticketAhead * 4}분
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-white/75">
                      {service.place}에서 호출됩니다
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[13.5px] font-semibold text-white">민원 처리 완료</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-white/75">
                      이용해 주셔서 감사합니다
                    </p>
                  </>
                )}
              </div>
              {flow === "done" && (
                <SealCheck size={22} weight="fill" className="shrink-0 text-white" />
              )}
            </div>
          </motion.div>
        )}

        {/* What this is */}
        <div className="px-5 pt-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--yi-primary-soft)]">
              <IconCmp size={22} weight="duotone" className="text-[var(--yi-primary)]" />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-[22px] font-bold leading-[30px] tracking-[-0.02em] text-[var(--yi-ink)]">
                {service.name}
              </h1>
              <div className="mt-1.5 flex items-center gap-2">
                <Stars value={service.rating.avg} />
                <span className="yi-num text-[12px] font-semibold text-[var(--yi-body)]">
                  {service.rating.avg.toFixed(1)}
                </span>
                <span className="yi-num text-[12px] text-[var(--yi-muted)]">
                  이용자 {service.rating.count.toLocaleString("ko-KR")}명 평가
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[14px] leading-[21px] text-[var(--yi-body)]">{service.desc}</p>
        </div>

        {/* Where to go */}
        <section className="mt-5 px-5">
          <div className="overflow-hidden rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)]">
            <div className="relative">
              <Photo id={EXTERIOR_PHOTO} alt="용인시청 본관 외관" className="h-[108px]" sizes="353px" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,26,45,0.30) 0%, rgba(8,32,58,0.86) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
                <p className="text-[11px] font-semibold text-white/75">처리 장소</p>
                <p className="mt-0.5 text-[16px] font-bold leading-[22px] text-white">
                  {service.place}
                </p>
                <p className="yi-num mt-1 text-[11.5px] text-white/70">
                  {BUILDING.name} {BUILDING.wing} | {floor.label} {floor.name}
                </p>
              </div>
            </div>

            <div className="px-4 pt-3">
              {/* Labelled so the tinted miniature reads as a plan, not a
                  loading skeleton. */}
              <div className="mb-1.5 flex items-center justify-between px-0.5">
                <span className="yi-num text-[11px] font-bold text-[var(--yi-muted)]">
                  {floor.label} 배치도
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-[7px] w-[7px] rounded-[2px]"
                    style={{ background: "var(--yi-cat-counter)" }}
                  />
                  <span className="text-[11px] font-medium text-[var(--yi-muted)]">
                    처리 창구 위치
                  </span>
                </span>
              </div>
              <MiniFloorMap
                floor={floor}
                facilities={facilitiesOnFloor(service.floor)}
                highlightId={service.facilityId}
              />
            </div>

            {facility && (
              <div className="flex items-start gap-2.5 px-4 pt-3">
                <Footprints
                  size={17}
                  weight="duotone"
                  className="mt-px shrink-0 text-[var(--yi-primary)]"
                />
                <p className="min-w-0 flex-1 text-[13px] leading-[19px] text-[var(--yi-body)]">
                  {facility.route}
                  {facility.distance ? `, ${facility.distance}` : ""}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                onNavigate("floor", { floor: service.floor, facilityId: service.facilityId })
              }
              className="yi-press m-4 flex h-11 w-[calc(100%-32px)] items-center justify-center gap-1.5 rounded-[11px] border border-[var(--yi-border-strong)] bg-[var(--yi-surface)] text-[14px] font-semibold text-[var(--yi-primary)]"
            >
              <MapPin size={16} weight="fill" />
              배치도에서 위치 보기
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </section>

        {/* Key numbers */}
        <section className="mt-4 px-5">
          <div className="flex items-stretch divide-x divide-[var(--yi-border)] rounded-[14px] border border-[var(--yi-border)] bg-[var(--yi-surface)]">
            <StatBox icon={Clock} label="이용 시간" value="09:00 ~ 18:00" note="평일" />
            <StatBox icon={Timer} label="예상 처리" value={service.duration} />
            <StatBox
              icon={CurrencyKrw}
              label="수수료"
              value={service.fee}
              note={service.feeNote}
            />
          </div>
          <p className="mt-2 px-1 text-[11.5px] leading-[16px] text-[var(--yi-muted-soft)]">
            {service.closed}
          </p>
        </section>

        {/* Documents */}
        <section className="mt-6 px-5">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--yi-ink)]">
            준비물
          </h2>
          <p className="mt-0.5 text-[13px] text-[var(--yi-muted)]">
            창구에 가기 전 아래 서류를 확인하세요
          </p>
          <div className="mt-3 overflow-hidden rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)]">
            {service.docs.map((d, i) => (
              <div
                key={d.label}
                className={`flex items-start gap-3 px-4 py-3.5 ${
                  i === service.docs.length - 1 ? "" : "border-b border-[var(--yi-border)]"
                }`}
              >
                <CheckCircle
                  size={19}
                  weight={d.required ? "fill" : "regular"}
                  className={`mt-px shrink-0 ${
                    d.required ? "text-[var(--yi-primary)]" : "text-[var(--yi-muted-soft)]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[14.5px] font-semibold text-[var(--yi-ink)]">
                    {d.label}
                    {!d.required && <Badge tone="neutral">해당 시</Badge>}
                  </p>
                  {d.note && (
                    <p className="mt-0.5 text-[12.5px] leading-[18px] text-[var(--yi-muted)]">
                      {d.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="mt-6 px-5">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--yi-ink)]">
            이용 절차
          </h2>
          <ol className="mt-3">
            {service.steps.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <div className="flex w-6 shrink-0 flex-col items-center">
                  <span className="yi-num flex h-6 w-6 items-center justify-center rounded-full bg-[var(--yi-primary)] text-[11.5px] font-bold text-[var(--yi-on-primary)]">
                    {i + 1}
                  </span>
                  {i < service.steps.length - 1 && (
                    <span className="w-px flex-1 bg-[var(--yi-border-strong)]" />
                  )}
                </div>
                <div className={`min-w-0 flex-1 ${i === service.steps.length - 1 ? "" : "pb-4"}`}>
                  <p className="text-[14.5px] font-semibold leading-[20px] text-[var(--yi-ink)]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-[19px] text-[var(--yi-body)]">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Unattended kiosk */}
        <section className="mt-6 px-5">
          <div
            className="flex items-start gap-3 rounded-[16px] px-4 py-4"
            style={{
              background: service.kiosk.available ? "#F0EEFC" : "var(--yi-surface-soft)",
            }}
          >
            {service.kiosk.available ? (
              <Printer size={20} weight="duotone" className="mt-px shrink-0 text-[var(--yi-cat-kiosk)]" />
            ) : (
              <Prohibit size={20} weight="duotone" className="mt-px shrink-0 text-[var(--yi-muted)]" />
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[14.5px] font-semibold text-[var(--yi-ink)]">
                무인민원발급기
                <Badge tone={service.kiosk.available ? "primary" : "neutral"}>
                  {service.kiosk.available ? "이용 가능" : "창구 방문 필요"}
                </Badge>
              </p>
              <p className="mt-1 text-[13px] leading-[19px] text-[var(--yi-body)]">
                {service.kiosk.note}
              </p>
              {service.kiosk.available && (
                <button
                  type="button"
                  onClick={() => onNavigate("floor", { floor: 1, facilityId: "f1-kiosk" })}
                  className="yi-press mt-2 flex items-center gap-1 text-[13px] font-semibold text-[var(--yi-cat-kiosk)]"
                >
                  발급기 위치 보기
                  <CaretRight size={13} weight="bold" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="mt-6 px-5">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--yi-ink)]">
            함께 처리하면 좋은 민원
          </h2>
          <div className="mt-3 overflow-hidden rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)]">
            {related.map((r, i) => {
              const RIcon = SERVICE_ICON[r.icon];
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onNavigate("service", { serviceId: r.id })}
                  className={`yi-press flex w-full items-center gap-3 px-4 py-3.5 text-left ${
                    i === related.length - 1 ? "" : "border-b border-[var(--yi-border)]"
                  }`}
                >
                  <RIcon size={18} weight="duotone" className="shrink-0 text-[var(--yi-primary)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-semibold text-[var(--yi-ink)]">
                      {r.name}
                    </span>
                    <span className="block truncate text-[12px] text-[var(--yi-muted)]">
                      {r.place}
                    </span>
                  </span>
                  <span className="yi-num shrink-0 text-[12px] font-medium text-[var(--yi-muted)]">
                    {r.fee}
                  </span>
                  <CaretRight size={14} weight="bold" className="shrink-0 text-[var(--yi-muted-soft)]" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Satisfaction */}
        <section className="mt-6 px-5">
          <div className="rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)] px-4 py-5 text-center">
            {submitted ? (
              <>
                <SealCheck size={28} weight="duotone" className="mx-auto text-[var(--yi-success)]" />
                <p className="mt-2 text-[15.5px] font-semibold text-[var(--yi-ink)]">
                  평가해 주셔서 감사합니다
                </p>
                <p className="yi-num mt-1 text-[13px] text-[var(--yi-muted)]">
                  {rating}점을 남기셨습니다. 현재 평균 {service.rating.avg.toFixed(1)}점
                </p>
              </>
            ) : (
              <>
                <p className="text-[15.5px] font-semibold text-[var(--yi-ink)]">
                  민원 이용은 어떠셨나요
                </p>
                <p className="mt-1 text-[12.5px] leading-[18px] text-[var(--yi-muted)]">
                  {flow === "done"
                    ? "평가는 창구 운영 개선에 사용됩니다"
                    : "민원 처리를 완료하면 평가할 수 있습니다"}
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      disabled={flow !== "done"}
                      onClick={() => setRating(n)}
                      aria-label={`${n}점`}
                      className="yi-press disabled:opacity-40"
                    >
                      <Star
                        size={32}
                        weight={n <= rating ? "fill" : "regular"}
                        className={n <= rating ? "text-[#E0A21A]" : "text-[var(--yi-border-strong)]"}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={rating === 0}
                  onClick={() => setSubmitted(true)}
                  className={`yi-press mt-4 h-11 w-full rounded-[11px] text-[14.5px] font-semibold ${
                    rating === 0
                      ? "bg-[var(--yi-surface-sunken)] text-[var(--yi-muted-soft)]"
                      : "bg-[var(--yi-primary)] text-[var(--yi-on-primary)]"
                  }`}
                >
                  평가 남기기
                </button>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Bottom action. Opaque surface, `pb-[34px]` for the home indicator.
          No z-index: it is a flex sibling, and raising it would stack above
          the ticket sheet. */}
      <div className="yi-edge-bar shrink-0 border-t border-[var(--yi-border)] px-5 pb-[34px] pt-3">
        {flow === "idle" && (
          <PrimaryButton
            icon={Ticket}
            onClick={() => {
              setFlow("ticket");
              setSheetOpen(true);
            }}
          >
            번호표 발급받기
          </PrimaryButton>
        )}
        {flow === "ticket" && (
          <PrimaryButton icon={SealCheck} onClick={() => setFlow("done")}>
            민원 처리 완료로 표시
          </PrimaryButton>
        )}
        {flow === "done" && (
          <div className="flex h-[52px] items-center justify-center gap-2 rounded-[12px] bg-[var(--yi-surface-soft)]">
            <SealCheck size={19} weight="fill" className="text-[var(--yi-success)]" />
            <span className="text-[14.5px] font-semibold text-[var(--yi-body)]">
              {submitted ? "평가까지 완료되었습니다" : "위에서 만족도를 평가해 주세요"}
            </span>
          </div>
        )}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="번호표가 발급되었습니다"
        footer={<PrimaryButton onClick={() => setSheetOpen(false)}>확인</PrimaryButton>}
      >
        <div className="rounded-[16px] border border-dashed border-[var(--yi-border-strong)] bg-[var(--yi-surface-soft)] px-4 py-6 text-center">
          <p className="text-[12px] font-semibold text-[var(--yi-muted)]">{service.place}</p>
          <p className="yi-num mt-1 text-[44px] font-bold leading-[52px] tracking-[-0.03em] text-[var(--yi-primary)]">
            {ticketCode}
          </p>
          <p className="yi-num mt-1 text-[13.5px] font-semibold text-[var(--yi-body)]">
            앞에 {ticketAhead}명, 예상 대기 {ticketAhead * 4}분
          </p>
        </div>
        <ul className="mt-4 space-y-2 pb-1">
          {[
            "호출 화면은 종합민원실과 시민 휴게 카페 양쪽에 있습니다.",
            "순서를 놓치면 창구 직원에게 번호를 말씀해 주세요.",
            "대기 중 준비물을 다시 확인하면 처리 시간이 짧아집니다.",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full bg-[var(--yi-muted-soft)]" />
              <span className="text-[13px] leading-[19px] text-[var(--yi-body)]">{t}</span>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </>
  );
}
