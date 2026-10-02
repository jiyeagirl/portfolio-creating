"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CaretRight,
  Clock,
  Elevator,
  Footprints,
  NavigationArrow,
  QrCode,
  Stairs,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import {
  BUILDING,
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  FACILITY_CATEGORY,
  FLOORS,
  facilitiesOnFloor,
  facilityById,
  floorById,
  servicesAtFacility,
} from "../../lib/mock-data";
import type { FacilityCategory, FloorId } from "../../lib/types";
import type { NavigateFn } from "../../lib/navigation";
import { FloorMap } from "../floor-map";
import { Badge, Chip, FACILITY_ICON, Photo, SPRING } from "../ui";

const FILTERS: { id: FacilityCategory | "all"; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "counter", label: CATEGORY_LABEL.counter },
  { id: "kiosk", label: CATEGORY_LABEL.kiosk },
  { id: "info", label: CATEGORY_LABEL.info },
  { id: "amenity", label: CATEGORY_LABEL.amenity },
  { id: "dept", label: CATEGORY_LABEL.dept },
  { id: "move", label: CATEGORY_LABEL.move },
];

const LEGEND: FacilityCategory[] = ["counter", "kiosk", "info", "amenity", "dept", "move"];

export function FloorScreen({
  floorId,
  selectedId,
  onNavigate,
  onChangeFloor,
  onSelectFacility,
}: {
  floorId: FloorId;
  selectedId?: string;
  onNavigate: NavigateFn;
  onChangeFloor: (floor: FloorId) => void;
  onSelectFacility: (id?: string) => void;
}) {
  const [filter, setFilter] = useState<FacilityCategory | "all">("all");
  const detailRef = useRef<HTMLDivElement>(null);

  const floor = floorById(floorId);
  const facilities = useMemo(() => facilitiesOnFloor(floorId), [floorId]);
  const selected = selectedId ? facilityById(selectedId) : undefined;
  const linkedServices = selected ? servicesAtFacility(selected.id) : [];

  /* Scroll the detail into view when the visitor picks a tile, but never on
     mount — landing on this screen should show the map, not skip past it. */
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selected]);

  /* On the entry floor the marker is where the visitor actually stands; on the
     others it is where they step off the elevator. Calling both "현재 위치"
     would contradict the strip at the top of the screen. */
  const onEntryFloor = floorId === BUILDING.entryFloor;
  const markerId = onEntryFloor ? "f1-entrance" : `f${floorId}-elevator`;
  const markerLabel = onEntryFloor ? "현재 위치" : "이 층 도착 지점";

  return (
    <>
      <ScreenHeader
        title="층별 안내"
        subtitle={`${BUILDING.name} ${BUILDING.wing}`}
        onBack={() => onNavigate("lobby")}
        className="yi-edge-bar border-[var(--yi-border)]"
        backButtonClassName="text-[var(--yi-ink)] active:bg-[var(--yi-surface-soft)]"
        titleClassName="text-[16px] font-semibold text-[var(--yi-ink)]"
        subtitleClassName="text-[11px] text-[var(--yi-muted)]"
      />

      <div className="flex-1 overflow-y-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Where the visitor is standing right now */}
        <div className="flex items-center gap-2 bg-[var(--yi-primary-soft)] px-5 py-2.5">
          <QrCode size={14} weight="bold" className="shrink-0 text-[var(--yi-primary)]" />
          <p className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[var(--yi-primary)]">
            현재 위치 {BUILDING.entryPoint}
          </p>
        </div>

        {/* Floor picker */}
        <div className="px-5 pt-4">
          <div className="flex gap-1.5 rounded-[12px] bg-[var(--yi-surface-soft)] p-1">
            {FLOORS.map((f) => {
              const on = f.id === floorId;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChangeFloor(f.id)}
                  aria-pressed={on}
                  className={`yi-press flex-1 rounded-[9px] py-2 transition-colors ${
                    on ? "bg-[var(--yi-surface)] yi-raised" : ""
                  }`}
                >
                  <span
                    className={`yi-num block text-[15px] font-bold leading-5 ${
                      on ? "text-[var(--yi-primary)]" : "text-[var(--yi-muted)]"
                    }`}
                  >
                    {f.label}
                  </span>
                  <span
                    className={`mt-px block truncate px-1 text-[10.5px] leading-[14px] ${
                      on ? "text-[var(--yi-body)]" : "text-[var(--yi-muted-soft)]"
                    }`}
                  >
                    {f.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 px-5 text-[13px] leading-[19px] text-[var(--yi-body)]">
          {floor.corridor}
        </p>

        {/* Category filter */}
        <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              active={filter === f.id}
              onClick={() => setFilter(f.id)}
              color={f.id === "all" ? undefined : CATEGORY_COLOR[f.id]}
            />
          ))}
        </div>

        {/* Pictogram floor plan */}
        <div className="mt-3 px-5">
          <FloorMap
            floor={floor}
            facilities={facilities}
            selectedId={selectedId}
            markerId={markerId}
            markerLabel={markerLabel}
            activeCategory={filter}
            onSelect={(id) => onSelectFacility(id === selectedId ? undefined : id)}
          />

          {/* Legend */}
          <div className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2 px-1">
            {LEGEND.map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span
                  className="h-[8px] w-[8px] shrink-0 rounded-[2px]"
                  style={{ background: CATEGORY_COLOR[c] }}
                />
                <span className="truncate text-[11px] font-medium text-[var(--yi-muted)]">
                  {CATEGORY_LABEL[c]}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Selected facility */}
        <div ref={detailRef} className="mt-4 px-5">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="overflow-hidden rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)]"
            >
              <div className="flex items-start gap-3 px-4 pb-3 pt-4">
                {(() => {
                  const IconCmp = FACILITY_ICON[selected.kind];
                  const color = CATEGORY_COLOR[FACILITY_CATEGORY[selected.kind]];
                  return (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]"
                      style={{ background: "var(--yi-surface-soft)" }}
                    >
                      <IconCmp size={21} weight="duotone" style={{ color }} />
                    </span>
                  );
                })()}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[17px] font-bold text-[var(--yi-ink)]">
                      {selected.name}
                    </h3>
                    <Badge tone="neutral">
                      {CATEGORY_LABEL[FACILITY_CATEGORY[selected.kind]]}
                    </Badge>
                  </div>
                  {selected.sub && (
                    <p className="mt-0.5 text-[12.5px] text-[var(--yi-muted)]">{selected.sub}</p>
                  )}
                </div>
              </div>

              <p className="px-4 pb-3 text-[13.5px] leading-[20px] text-[var(--yi-body)]">
                {selected.detail}
              </p>

              {/* Walking directions, the whole point of the screen */}
              <div className="mx-4 mb-3 flex items-start gap-2.5 rounded-[12px] bg-[var(--yi-primary-soft)] px-3.5 py-3">
                <Footprints
                  size={18}
                  weight="duotone"
                  className="mt-px shrink-0 text-[var(--yi-primary)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold leading-[19px] text-[var(--yi-primary)]">
                    {selected.route}
                  </p>
                  {selected.distance && (
                    <p className="yi-num mt-0.5 text-[12px] text-[var(--yi-primary)] opacity-80">
                      정문에서 {selected.distance}, 도보 1분 이내
                    </p>
                  )}
                </div>
              </div>

              {(selected.queue !== undefined || selected.hours) && (
                <div className="mx-4 mb-3 flex items-center gap-4 rounded-[12px] border border-[var(--yi-border)] px-3.5 py-2.5">
                  {selected.queue !== undefined && (
                    <span className="flex items-center gap-2">
                      <NavigationArrow size={14} weight="fill" className="text-[var(--yi-muted-soft)]" />
                      <span className="yi-num text-[12.5px] font-semibold text-[var(--yi-ink)]">
                        {selected.queue === 0 ? "대기 없음" : `${selected.queue}명 대기`}
                      </span>
                    </span>
                  )}
                  {selected.hours && (
                    <span className="flex min-w-0 items-center gap-2">
                      <Clock size={14} weight="duotone" className="shrink-0 text-[var(--yi-muted-soft)]" />
                      <span className="yi-num truncate text-[12.5px] text-[var(--yi-body)]">
                        {selected.hours}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {selected.tags && selected.tags.length > 0 && (
                <div className="mx-4 mb-3 flex flex-wrap gap-1.5">
                  {selected.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[var(--yi-surface-soft)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--yi-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {selected.photoId && (
                <Photo
                  id={selected.photoId}
                  alt={selected.photoCaption ?? selected.name}
                  className="mx-4 mb-4 h-[112px] rounded-[12px]"
                  sizes="329px"
                />
              )}

              {linkedServices.length > 0 && (
                <div className="border-t border-[var(--yi-border)]">
                  <p className="px-4 pb-1 pt-3 text-[12px] font-semibold text-[var(--yi-muted)]">
                    이 위치에서 처리하는 민원
                  </p>
                  {linkedServices.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onNavigate("service", { serviceId: s.id })}
                      className={`yi-press flex w-full items-center gap-2 px-4 py-3 text-left ${
                        i === linkedServices.length - 1 ? "" : "border-b border-[var(--yi-border)]"
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[var(--yi-ink)]">
                        {s.name}
                      </span>
                      <span className="yi-num shrink-0 text-[12px] text-[var(--yi-muted)]">
                        {s.duration}
                      </span>
                      <CaretRight size={14} weight="bold" className="shrink-0 text-[var(--yi-muted-soft)]" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="rounded-[16px] border border-dashed border-[var(--yi-border-strong)] px-4 py-6 text-center">
              <p className="text-[13.5px] font-medium text-[var(--yi-body)]">
                배치도에서 시설을 누르면 위치 안내가 나옵니다
              </p>
              <p className="mt-1 text-[12px] leading-[17px] text-[var(--yi-muted)]">
                창구, 번호표 발급기, 화장실 모두 같은 방식으로 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* How to reach another floor */}
        {floorId !== BUILDING.entryFloor && (
          <div className="mt-4 px-5">
            <div className="rounded-[16px] bg-[var(--yi-surface-soft)] px-4 py-4">
              <h3 className="text-[14px] font-semibold text-[var(--yi-ink)]">
                {BUILDING.entryFloor}층에서 {floorId}층으로 이동
              </h3>
              <div className="mt-2.5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <Elevator size={18} weight="duotone" className="shrink-0 text-[var(--yi-cat-move)]" />
                  <p className="min-w-0 flex-1 text-[13px] leading-[19px] text-[var(--yi-body)]">
                    엘리베이터는 1층 안내데스크 뒤편 왼쪽에 있습니다. 3대 모두 휠체어 이용이 가능합니다.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Stairs size={18} weight="duotone" className="shrink-0 text-[var(--yi-cat-move)]" />
                  <p className="min-w-0 flex-1 text-[13px] leading-[19px] text-[var(--yi-body)]">
                    중앙 계단은 안내데스크 뒤편 오른쪽이며 양쪽에 손잡이가 있습니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectFacility(`f${floorId}-elevator`)}
                className="yi-press mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] border border-[var(--yi-border-strong)] bg-[var(--yi-surface)] text-[13.5px] font-semibold text-[var(--yi-body)]"
              >
                {floorId}층 도착 지점 보기
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
