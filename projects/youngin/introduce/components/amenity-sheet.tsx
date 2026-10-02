"use client";

import { CaretRight } from "@phosphor-icons/react";
import { BottomSheet, FACILITY_ICON } from "./ui";
import { CATEGORY_COLOR, FACILITIES, FACILITY_CATEGORY, floorById } from "../lib/mock-data";
import type { FloorId } from "../lib/types";

/* Amenities are the single most repeated question at a public counter, so they
   get a sheet reachable from every screen instead of living inside one tab. */

const AMENITY_KINDS = new Set(["restroom", "restroomAccessible", "nursing", "cafe", "water", "atm", "parking"]);

export function AmenitySheet({
  open,
  onClose,
  onGo,
}: {
  open: boolean;
  onClose: () => void;
  onGo: (floor: FloorId, facilityId: string) => void;
}) {
  const items = FACILITIES.filter(
    (f) => AMENITY_KINDS.has(f.kind) || f.kind === "elevator"
  );
  const byFloor: FloorId[] = [1, 2, 3];

  return (
    <BottomSheet open={open} onClose={onClose} title="편의시설 찾기">
      <p className="pb-3 text-[13px] leading-[19px] text-[var(--yi-muted)]">
        층을 눌러 확인하지 않아도 됩니다. 아래에서 바로 고르면 해당 층 배치도에서 위치가 표시됩니다.
      </p>
      <div className="space-y-4 pb-2">
        {byFloor.map((floorId) => {
          const floorItems = items.filter((f) => f.floor === floorId);
          if (floorItems.length === 0) return null;
          const floor = floorById(floorId);
          return (
            <section key={floorId}>
              <h4 className="mb-2 flex items-baseline gap-2">
                <span className="yi-num text-[14px] font-bold text-[var(--yi-ink)]">
                  {floor.label}
                </span>
                <span className="text-[12px] text-[var(--yi-muted)]">{floor.name}</span>
              </h4>
              <div className="overflow-hidden rounded-[12px] border border-[var(--yi-border)]">
                {floorItems.map((f, i) => {
                  const IconCmp = FACILITY_ICON[f.kind];
                  const color = CATEGORY_COLOR[FACILITY_CATEGORY[f.kind]];
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onGo(f.floor, f.id)}
                      className={`yi-press flex w-full items-center gap-3 bg-[var(--yi-surface)] px-3 py-2.5 text-left ${
                        i === floorItems.length - 1 ? "" : "border-b border-[var(--yi-border)]"
                      }`}
                    >
                      <IconCmp size={19} weight="duotone" style={{ color }} className="shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold text-[var(--yi-ink)]">
                          {f.name}
                        </span>
                        <span className="block truncate text-[12px] text-[var(--yi-muted)]">
                          {f.route}
                        </span>
                      </span>
                      {f.distance && (
                        <span className="yi-num shrink-0 text-[12px] font-medium text-[var(--yi-muted-soft)]">
                          {f.distance}
                        </span>
                      )}
                      <CaretRight size={14} weight="bold" className="shrink-0 text-[var(--yi-muted-soft)]" />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </BottomSheet>
  );
}
