"use client";

import { ArrowBendUpLeft, ArrowBendUpRight, NavigationArrow } from "@phosphor-icons/react";
import type { Facility, FacilityCategory, Floor } from "../lib/types";
import { CATEGORY_COLOR, FACILITY_CATEGORY } from "../lib/mock-data";
import { FACILITY_ICON } from "./ui";

/* Pictogram floor plan, not a survey drawing. Zones stack top to bottom
   because 393px can't carry three side-by-side wings legibly; the corridor
   strip between them carries the west/east orientation instead.
   Tiles keep their slot when filtered out (dimmed, never removed) so the
   layout stays stable and the map keeps reading as the same room. */

const SPAN_CLASS: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  4: "col-span-4",
};

function Tile({
  facility,
  selected,
  dimmed,
  marker,
  onSelect,
}: {
  facility: Facility;
  selected: boolean;
  dimmed: boolean;
  /** "현재 위치" on the entry floor, "도착 지점" on the others. */
  marker?: string;
  onSelect: (id: string) => void;
}) {
  const category = FACILITY_CATEGORY[facility.kind];
  const color = CATEGORY_COLOR[category];
  const IconCmp = FACILITY_ICON[facility.kind];

  return (
    <button
      type="button"
      onClick={() => onSelect(facility.id)}
      aria-pressed={selected}
      className={`${SPAN_CLASS[facility.span]} relative flex h-[72px] flex-col items-center justify-center gap-1 rounded-[8px] border px-1.5 text-center transition-[background-color,border-color,opacity] duration-150 ${
        selected
          ? "yi-raised border-transparent"
          : "border-[var(--yi-border)] bg-[var(--yi-surface)]"
      } ${dimmed ? "opacity-35" : ""}`}
      style={
        selected
          ? { background: "var(--yi-primary-soft)", boxShadow: `inset 0 0 0 2px ${color}` }
          : undefined
      }
    >
      {marker && (
        <span className="absolute -top-[9px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-[var(--yi-primary)] px-2 py-[2px] text-[10px] font-bold leading-[14px] text-[var(--yi-on-primary)]">
          <NavigationArrow size={9} weight="fill" />
          {marker}
        </span>
      )}
      <IconCmp size={19} weight="duotone" style={{ color }} />
      <span className="w-full truncate text-[11.5px] font-semibold leading-[15px] text-[var(--yi-ink)]">
        {facility.name}
      </span>
      {facility.sub && (
        <span className="w-full truncate text-[10px] leading-[13px] text-[var(--yi-muted)]">
          {facility.sub}
        </span>
      )}
    </button>
  );
}

function Corridor({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-1 py-2.5" aria-hidden>
      <ArrowBendUpLeft size={13} weight="bold" className="shrink-0 text-[var(--yi-muted-soft)]" />
      <span className="h-px flex-1 border-t border-dashed border-[var(--yi-border-strong)]" />
      <span className="shrink-0 text-[10px] font-semibold tracking-[0.06em] text-[var(--yi-muted-soft)]">
        {label}
      </span>
      <span className="h-px flex-1 border-t border-dashed border-[var(--yi-border-strong)]" />
      <ArrowBendUpRight size={13} weight="bold" className="shrink-0 text-[var(--yi-muted-soft)]" />
    </div>
  );
}

export function FloorMap({
  floor,
  facilities,
  selectedId,
  markerId,
  markerLabel,
  activeCategory,
  onSelect,
}: {
  floor: Floor;
  facilities: Facility[];
  selectedId?: string;
  markerId?: string;
  markerLabel: string;
  activeCategory: FacilityCategory | "all";
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-[16px] border border-[var(--yi-border-strong)] bg-[var(--yi-surface-sunken)] p-3">
      {floor.zones.map((zone, zoneIndex) => {
        const zoneFacilities = facilities.filter((f) => f.zone === zone.id);
        if (zoneFacilities.length === 0) return null;

        return (
          <div key={zone.id}>
            {zoneIndex > 0 && <Corridor label="중앙 복도" />}
            <div className="mb-1.5 flex items-center gap-1.5 px-0.5">
              <span className="h-[3px] w-[3px] rounded-full bg-[var(--yi-muted-soft)]" />
              <span className="text-[10.5px] font-bold tracking-[0.04em] text-[var(--yi-muted)]">
                {zone.label}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {zoneFacilities.map((f) => (
                <Tile
                  key={f.id}
                  facility={f}
                  selected={f.id === selectedId}
                  dimmed={activeCategory !== "all" && FACILITY_CATEGORY[f.kind] !== activeCategory}
                  marker={f.id === markerId ? markerLabel : undefined}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Compact version reused on the service detail screen. Read only: it shows
 *  where the counter sits without pulling the whole map screen along. */
export function MiniFloorMap({
  floor,
  facilities,
  highlightId,
}: {
  floor: Floor;
  facilities: Facility[];
  highlightId: string;
}) {
  return (
    <div className="rounded-[12px] border border-[var(--yi-border-strong)] bg-[var(--yi-surface-sunken)] p-2">
      {floor.zones.map((zone, zoneIndex) => {
        const zoneFacilities = facilities.filter((f) => f.zone === zone.id);
        if (zoneFacilities.length === 0) return null;
        return (
          <div key={zone.id}>
            {zoneIndex > 0 && (
              <div className="my-1.5 h-px border-t border-dashed border-[var(--yi-border-strong)]" />
            )}
            <div className="grid grid-cols-4 gap-1">
              {zoneFacilities.map((f) => {
                const active = f.id === highlightId;
                const color = CATEGORY_COLOR[FACILITY_CATEGORY[f.kind]];
                return (
                  <div
                    key={f.id}
                    className={`${SPAN_CLASS[f.span]} flex h-[15px] items-center justify-center rounded-[3px] px-1`}
                    /* Unhighlighted rooms keep a faint wash of their own
                       category color, so the miniature still reads as a plan
                       rather than a row of empty gray boxes. */
                    style={{ background: color, opacity: active ? 1 : 0.18 }}
                  >
                    {active && (
                      <span className="truncate text-[9px] font-bold leading-none text-white">
                        {f.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
