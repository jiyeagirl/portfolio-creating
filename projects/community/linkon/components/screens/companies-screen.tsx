"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Buildings, MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react";
import { COMPANIES, MY_COMPANY } from "@/projects/community/linkon/lib/mock-data";
import type { Company } from "@/projects/community/linkon/lib/types";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  Chip,
  BrandMark,
  EmptyState,
  Reveal,
  VerifiedBadge,
} from "@/projects/community/linkon/components/layout/ui";

const INDUSTRIES = [
  "AI·데이터",
  "헬스케어",
  "핀테크",
  "모빌리티",
  "푸드테크",
  "친환경·에너지",
  "에듀테크",
  "커머스",
  "제조·하드웨어",
  "콘텐츠",
];
const REGIONS = ["서울", "경기", "인천", "부산", "대구", "대전", "전북"];
const SIZES = ["10인 미만", "10-19인", "20인 이상"];
const AGES = ["3년 미만", "3-4년", "5년 이상"];
const KEYWORDS = [
  "제조 AI",
  "친환경 소재",
  "물류 자동화",
  "데이터 연동",
  "소상공인",
  "산학협력",
  "재활",
  "에너지 관리",
];

type SortKey = "recent" | "collab" | "name";

function matchSize(company: Company, size: string) {
  if (size === "10인 미만") return company.employees < 10;
  if (size === "10-19인") return company.employees >= 10 && company.employees < 20;
  return company.employees >= 20;
}

function matchAge(company: Company, age: string) {
  const years = 2026 - company.foundedYear;
  if (age === "3년 미만") return years < 3;
  if (age === "3-4년") return years >= 3 && years < 5;
  return years >= 5;
}

export function CompaniesScreen({
  onNavigate,
  initialQuery,
}: {
  onNavigate: NavigateFn;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [industry, setIndustry] = useState<string[]>([]);
  const [region, setRegion] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [age, setAge] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [investedOnly, setInvestedOnly] = useState(false);
  const [collabOnly, setCollabOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("recent");
  const [filterOpen, setFilterOpen] = useState(false);

  const toggle = (
    value: string,
    list: string[],
    setList: (next: string[]) => void,
  ) => setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = COMPANIES.filter((company) => {
      if (
        q &&
        !company.name.toLowerCase().includes(q) &&
        !company.enName.toLowerCase().includes(q) &&
        !company.ceo.toLowerCase().includes(q)
      )
        return false;
      if (industry.length && !industry.includes(company.industry)) return false;
      if (region.length && !region.some((r) => company.region.startsWith(r))) return false;
      if (size.length && !size.some((s) => matchSize(company, s))) return false;
      if (age.length && !age.some((a) => matchAge(company, a))) return false;
      if (keywords.length && !keywords.some((k) => company.keywords.includes(k))) return false;
      if (investedOnly && !company.invested) return false;
      if (collabOnly && company.collabStatus !== "협업 가능") return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "collab") return b.openCollabs.length - a.openCollabs.length;
      return b.joinedAt.localeCompare(a.joinedAt);
    });
  }, [query, industry, region, size, age, keywords, investedOnly, collabOnly, sort]);

  const activeFilterCount =
    industry.length +
    region.length +
    size.length +
    age.length +
    keywords.length +
    (investedOnly ? 1 : 0) +
    (collabOnly ? 1 : 0);

  const resetAll = () => {
    setIndustry([]);
    setRegion([]);
    setSize([]);
    setAge([]);
    setKeywords([]);
    setInvestedOnly(false);
    setCollabOnly(false);
  };

  const filterPanel = (
    <div className="space-y-7">
      <FilterGroup title="산업 분야">
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((item) => (
            <Chip key={item} active={industry.includes(item)} onClick={() => toggle(item, industry, setIndustry)}>
              {item}
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="지역">
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((item) => (
            <Chip key={item} active={region.includes(item)} onClick={() => toggle(item, region, setRegion)}>
              {item}
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="기업 규모">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((item) => (
            <Chip key={item} active={size.includes(item)} onClick={() => toggle(item, size, setSize)}>
              {item}
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="창업 연차">
        <div className="flex flex-wrap gap-2">
          {AGES.map((item) => (
            <Chip key={item} active={age.includes(item)} onClick={() => toggle(item, age, setAge)}>
              {item}
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="관심 분야">
        <div className="flex flex-wrap gap-2">
          {KEYWORDS.map((item) => (
            <Chip key={item} active={keywords.includes(item)} onClick={() => toggle(item, keywords, setKeywords)}>
              {item}
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="추가 조건">
        <div className="space-y-3">
          <ToggleRow
            label="투자 유치 기업만"
            checked={investedOnly}
            onChange={() => setInvestedOnly((v) => !v)}
          />
          <ToggleRow
            label="협업 가능 기업만"
            checked={collabOnly}
            onChange={() => setCollabOnly((v) => !v)}
          />
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[var(--lk-ink)]">회원 기업 찾기</h1>
          <p className="mt-2 text-[14px] text-[var(--lk-muted)]">
            인증을 마친 선정기업 {COMPANIES.length}곳 중에서 조건에 맞는 협업 상대를 찾아보세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["recent", "collab", "name"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                sort === key
                  ? "bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                  : "text-[var(--lk-muted)] hover:text-[var(--lk-ink)]"
              }`}
            >
              {key === "recent" ? "최근 가입순" : key === "collab" ? "협업 모집순" : "이름순"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[268px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[92px] rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-[var(--lk-ink)]">필터</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAll}
                  className="text-[12.5px] font-semibold text-[var(--lk-muted)] hover:text-[var(--lk-danger)]"
                >
                  초기화
                </button>
              )}
            </div>
            <div className="mt-5">{filterPanel}</div>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-3.5 py-2.5">
              <MagnifyingGlass size={17} className="shrink-0 text-[var(--lk-muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="기업명 또는 대표자명을 입력하세요"
                aria-label="기업 검색"
                className="w-full bg-transparent text-[14px] text-[var(--lk-ink)] outline-none"
              />
              {query && (
                <button aria-label="검색어 지우기" onClick={() => setQuery("")}>
                  <X size={15} className="text-[var(--lk-muted)]" />
                </button>
              )}
            </div>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-4 py-2.5 text-[13.5px] font-semibold text-[var(--lk-ink)] lg:hidden"
            >
              <SlidersHorizontal size={16} />
              필터
              {activeFilterCount > 0 && (
                <span className="lk-num rounded-full bg-[var(--lk-accent)] px-1.5 text-[11px] text-[var(--lk-accent-fg)]">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {filterOpen && (
            <div className="mt-4 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5 lg:hidden">
              {filterPanel}
            </div>
          )}

          <p className="lk-num mt-5 text-[13px] font-medium text-[var(--lk-muted)]">
            총 {results.length}곳
            {activeFilterCount > 0 && ` (필터 ${activeFilterCount}개 적용)`}
          </p>

          {results.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                icon={<Buildings size={22} />}
                title="조건에 맞는 기업이 없습니다"
                description="검색어를 줄이거나 필터를 초기화하면 더 많은 기업을 볼 수 있습니다."
                action={
                  <button
                    onClick={() => {
                      resetAll();
                      setQuery("");
                    }}
                    className="mt-1 rounded-full border border-[var(--lk-border)] px-4 py-2 text-[13px] font-semibold text-[var(--lk-ink)] hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
                  >
                    조건 초기화
                  </button>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {results.map((company, index) => (
                <Reveal key={company.id} delay={Math.min(index, 6) * 0.03}>
                  <li>
                    <button
                      onClick={() => onNavigate("companyDetail", company.id)}
                      className="group flex w-full flex-col gap-4 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5 text-left transition-colors hover:border-[var(--lk-accent)] sm:flex-row sm:items-start"
                    >
                      <img
                        src={company.cover}
                        alt=""
                        className="h-[112px] w-full shrink-0 rounded-xl object-cover sm:h-[104px] sm:w-[152px]"
                      />
                      <div className="min-w-0 flex-1">
                        <BrandMark logo={company.logo} size={38} />
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <p className="text-[17px] font-bold text-[var(--lk-ink)]">{company.name}</p>
                          <VerifiedBadge />
                          {company.id === MY_COMPANY.id && <Badge tone="accent">내 기업</Badge>}
                        </div>
                        <p className="mt-2 text-[14px] leading-relaxed text-[var(--lk-muted)]">
                          {company.oneLiner}
                        </p>
                        <div className="lk-num mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[var(--lk-muted)]">
                          <span className="font-semibold text-[var(--lk-ink)]">{company.industry}</span>
                          <span>{company.region}</span>
                          <span>{company.employees}명</span>
                          <span>{company.foundedYear}년 설립</span>
                          <span>{company.stage}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          {company.services.slice(0, 2).map((service) => (
                            <span
                              key={service}
                              className="rounded-full bg-[var(--lk-surface)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--lk-muted)]"
                            >
                              {service}
                            </span>
                          ))}
                          {company.keywords.slice(0, 2).map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-full border border-[var(--lk-border)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--lk-muted)]"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end">
                        <Badge
                          tone={
                            company.collabStatus === "협업 가능"
                              ? "success"
                              : company.collabStatus === "협업 진행중"
                                ? "warning"
                                : "neutral"
                          }
                        >
                          {company.collabStatus}
                        </Badge>
                        {company.openCollabs.length > 0 && (
                          <span className="lk-num text-[12.5px] font-semibold text-[var(--lk-accent)]">
                            모집 중 {company.openCollabs.length}건
                          </span>
                        )}
                        <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--lk-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--lk-accent)] sm:ml-0 sm:mt-auto">
                          프로필
                          <ArrowRight size={14} weight="bold" />
                        </span>
                      </div>
                    </button>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[12.5px] font-bold text-[var(--lk-ink)]">{title}</p>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="flex w-full items-center justify-between gap-3 text-[13.5px] font-medium text-[var(--lk-ink)]"
    >
      {label}
      <span
        className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
          checked ? "bg-[var(--lk-accent)]" : "bg-[var(--lk-border)]"
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-[19px]" : "left-[3px]"
          }`}
        />
      </span>
    </button>
  );
}
