"use client";

import { useState } from "react";
import { ArrowsClockwise, Sparkle, Translate } from "@phosphor-icons/react";
import { Badge, Button, Card, CardHead, Cell, Field, Input, PageHead, Row, Segmented, Select, Table } from "@/projects/platform/studyspot/components/admin/admin-ui";
import { CONTENT_KIND_LABEL, dateTime, type HqNavigate } from "@/projects/platform/studyspot/lib/navigation";
import { AI_DRAFTS } from "@/projects/platform/studyspot/lib/mock-data";

/* ── 옵션 ── */

const KIND_OPTIONS = Object.values(CONTENT_KIND_LABEL);

const TONE_OPTIONS = ["친근한", "공식적인", "활기찬", "차분한"] as const;
type ToneOption = (typeof TONE_OPTIONS)[number];

const LANGUAGE_OPTIONS = ["영어", "중국어(간체)", "일본어", "베트남어"] as const;
type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

const DEFAULT_SOURCE_INPUT = "여름방학 특별 프로모션, 자유석 정기권 3개월 20% 할인, 6월 한정";

const TEXTAREA_CLASS =
  "w-full resize-none rounded-[6px] border border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] px-3 py-2.5 text-[14px] leading-6 text-[var(--ss-ink)] outline-none transition-colors placeholder:text-[var(--ss-mute)] focus:border-[var(--ss-ink)]";

/* ── 한국어 초안 생성 ── */

const KO_TITLE_BY_TONE: Record<ToneOption, (headline: string) => string> = {
  친근한: (headline) => `${headline} 시작해요`,
  공식적인: (headline) => `${headline} 안내`,
  활기찬: (headline) => `${headline}, 지금 바로 확인하세요`,
  차분한: (headline) => `${headline} 안내드립니다`,
};

const KO_CLOSING_BY_TONE: Record<ToneOption, string> = {
  친근한: "지금 바로 확인해보세요!",
  공식적인: "자세한 내용은 앱 공지사항을 참고해 주시기 바랍니다.",
  활기찬: "놓치면 후회하는 이번 기회, 서두르세요!",
  차분한: "편안한 마음으로 확인해 주세요.",
};

function splitSegments(sourceInput: string) {
  return sourceInput
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function buildKoreanDraft(sourceInput: string, tone: ToneOption, kindLabel: string) {
  const segments = splitSegments(sourceInput);
  const headline = segments[0] || kindLabel;
  const rest = segments.slice(1);
  const restText = rest.length > 0 ? `${rest.join(". ")}.` : "";
  return {
    title: KO_TITLE_BY_TONE[tone](headline),
    body: `${restText} ${KO_CLOSING_BY_TONE[tone]}`.trim(),
  };
}

/* ── 번역 생성 ──
 * 실제 번역 API 없이도 그럴듯한 다국어 결과를 보여주기 위해, 기본 예시 문구("여름방학 특별
 * 프로모션" 등)는 언어별 사전으로 정확히 번역하고, 그 외 문구는 톤별 문장 틀에 그대로
 * 끼워 넣는다. 오퍼레이터가 기본 예시를 그대로 쓰는 데모 경로에서는 완전한 번역문이,
 * 문구를 바꿔도 항상 톤에 맞는 문장 구조가 나온다. */

type LangTemplate = {
  headlineDict: Record<string, string>;
  restDict: Record<string, string>;
  titleTemplate: (headline: string, tone: ToneOption) => string;
  closingByTone: Record<ToneOption, string>;
};

const LANGUAGE_TEMPLATE: Record<LanguageOption, LangTemplate> = {
  영어: {
    headlineDict: { "여름방학 특별 프로모션": "Summer Break Special Promotion" },
    restDict: {
      "자유석 정기권 3개월 20% 할인": "20% off the 3-month free-seat pass",
      "6월 한정": "June only",
    },
    titleTemplate: (headline, tone) =>
      ({
        친근한: `${headline} Is Here`,
        공식적인: `Notice: ${headline}`,
        활기찬: `${headline}, Don't Miss Out`,
        차분한: `${headline} Announcement`,
      })[tone],
    closingByTone: {
      친근한: "Check it out now!",
      공식적인: "Please see the in-app notice for full details.",
      활기찬: "Hurry, this offer won't last!",
      차분한: "Please take a moment to review the details.",
    },
  },
  "중국어(간체)": {
    headlineDict: { "여름방학 특별 프로모션": "暑假特别促销" },
    restDict: {
      "자유석 정기권 3개월 20% 할인": "自由座位定期票（3个月）立减20%",
      "6월 한정": "仅限6月",
    },
    titleTemplate: (headline, tone) =>
      ({
        친근한: `${headline}来啦`,
        공식적인: `${headline}公告`,
        활기찬: `${headline}，快来了解`,
        차분한: `${headline}通知`,
      })[tone],
    closingByTone: {
      친근한: "快去看看吧！",
      공식적인: "详情请参见应用内公告。",
      활기찬: "机会难得，千万别错过！",
      차분한: "请您留意查看详细内容。",
    },
  },
  일본어: {
    headlineDict: { "여름방학 특별 프로모션": "夏休み特別プロモーション" },
    restDict: {
      "자유석 정기권 3개월 20% 할인": "フリー席定期券（3ヶ月）が20%オフ",
      "6월 한정": "6月限定",
    },
    titleTemplate: (headline, tone) =>
      ({
        친근한: `${headline}スタート`,
        공식적인: `${headline}のお知らせ`,
        활기찬: `${headline}、今すぐチェック`,
        차분한: `${headline}のご案内`,
      })[tone],
    closingByTone: {
      친근한: "今すぐチェックしてくださいね！",
      공식적인: "詳細はアプリ内のお知らせをご確認ください。",
      활기찬: "この機会をお見逃しなく！",
      차분한: "ゆっくりとご確認くださいませ。",
    },
  },
  베트남어: {
    headlineDict: { "여름방학 특별 프로모션": "Khuyến mãi đặc biệt mùa hè" },
    restDict: {
      "자유석 정기권 3개월 20% 할인": "Giảm 20% gói vé cố định chỗ ngồi tự do 3 tháng",
      "6월 한정": "Chỉ trong tháng 6",
    },
    titleTemplate: (headline, tone) =>
      ({
        친근한: `${headline} đã có mặt`,
        공식적인: `Thông báo: ${headline}`,
        활기찬: `${headline}, xem ngay`,
        차분한: `Thông tin về ${headline}`,
      })[tone],
    closingByTone: {
      친근한: "Xem ngay nhé!",
      공식적인: "Vui lòng xem thông báo trong ứng dụng để biết thêm chi tiết.",
      활기찬: "Đừng bỏ lỡ cơ hội này!",
      차분한: "Vui lòng dành chút thời gian xem chi tiết.",
    },
  },
};

function buildTranslation(language: LanguageOption, sourceInput: string, tone: ToneOption) {
  const template = LANGUAGE_TEMPLATE[language];
  const segments = splitSegments(sourceInput);
  const headlineKo = segments[0] ?? "";
  const restKo = segments.slice(1);
  const headline = template.headlineDict[headlineKo] ?? headlineKo;
  const restTranslated = restKo.map((segment) => template.restDict[segment] ?? segment);
  const restText = restTranslated.length > 0 ? `${restTranslated.join(". ")}.` : "";
  return {
    title: template.titleTemplate(headline, tone),
    body: `${restText} ${template.closingByTone[tone]}`.trim(),
  };
}

/* ── 화면 ── */

export function AiContentScreen({}: { onNavigate: HqNavigate }) {
  const [kind, setKind] = useState(KIND_OPTIONS[0]);
  const [tone, setTone] = useState<ToneOption>("친근한");
  const [sourceInput, setSourceInput] = useState(DEFAULT_SOURCE_INPUT);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageOption[]>(["영어", "중국어(간체)"]);
  const [generating, setGenerating] = useState(false);
  const [koDraft, setKoDraft] = useState<{ title: string; body: string } | null>(null);
  const [translations, setTranslations] = useState<Partial<Record<LanguageOption, { title: string; body: string }>>>({});
  const [published, setPublished] = useState(false);

  const toggleLanguage = (language: LanguageOption) => {
    setSelectedLanguages((prev) => (prev.includes(language) ? prev.filter((item) => item !== language) : [...prev, language]));
  };

  const handleGenerate = () => {
    setPublished(false);
    setGenerating(true);
    setTimeout(() => {
      setKoDraft(buildKoreanDraft(sourceInput, tone, kind));
      const nextTranslations: Partial<Record<LanguageOption, { title: string; body: string }>> = {};
      selectedLanguages.forEach((language) => {
        nextTranslations[language] = buildTranslation(language, sourceInput, tone);
      });
      setTranslations(nextTranslations);
      setGenerating(false);
    }, 800);
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 2600);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        eyebrow="본사 관리자 콘솔"
        title="AI 다국어 콘텐츠 작성"
        desc="핵심 내용과 톤앤매너만 정하면 공지사항, 이벤트 문구를 AI가 초안으로 작성하고 선택한 언어로 함께 번역합니다."
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 좌측 – 작성 패널 */}
        <div className="flex flex-col gap-5 lg:w-[40%] lg:shrink-0">
          <Card>
            <CardHead title="콘텐츠 정보" desc="생성할 콘텐츠의 종류와 어조를 정해주세요" />
            <div className="flex flex-col gap-4">
              <Field label="콘텐츠 종류">
                <Select value={kind} options={KIND_OPTIONS} onChange={setKind} />
              </Field>

              <Field label="톤앤매너">
                <Segmented value={tone} items={TONE_OPTIONS.map((item) => ({ key: item, label: item }))} onChange={setTone} />
              </Field>

              <Field label="핵심 내용" hint="쉼표로 구분해 핵심 포인트를 나열하면 AI가 문장으로 풀어씁니다.">
                <textarea
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  rows={4}
                  placeholder="예: 여름방학 특별 프로모션, 자유석 정기권 3개월 20% 할인, 6월 한정"
                  className={TEXTAREA_CLASS}
                />
              </Field>

              <Field label="번역 언어 선택" hint="선택한 언어마다 초안과 함께 번역본이 생성됩니다.">
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((language) => {
                    const active = selectedLanguages.includes(language);
                    return (
                      <button
                        key={language}
                        type="button"
                        onClick={() => toggleLanguage(language)}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                          active
                            ? "border-[var(--ss-ink)] bg-[var(--ss-ink)] text-[var(--ss-on-ink)]"
                            : "border-[var(--ss-hairline-strong)] bg-[var(--ss-canvas)] text-[var(--ss-body)] hover:bg-[var(--ss-canvas-soft)]"
                        }`}
                      >
                        {language}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Button full icon={<Sparkle size={16} weight="fill" />} disabled={generating} onClick={handleGenerate}>
                {generating ? "생성 중..." : "AI 초안 생성하기"}
              </Button>
            </div>
          </Card>
        </div>

        {/* 우측 – 결과 패널 */}
        <div className="flex-1 min-w-0">
          <Card className="min-h-[420px]">
            {generating ? (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-3 py-16 text-center">
                <ArrowsClockwise size={28} className="motion-safe:animate-spin text-[var(--ss-mute)]" />
                <p className="text-[14px] text-[var(--ss-body)]">AI가 콘텐츠를 작성하고 있어요</p>
                <p className="text-[12px] text-[var(--ss-mute)]">한국어 초안과 {selectedLanguages.length}개 언어 번역을 준비하는 중입니다</p>
              </div>
            ) : !koDraft ? (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ss-surface)] text-[var(--ss-mute)]">
                  <Sparkle size={20} />
                </span>
                <p className="text-[14px] font-medium text-[var(--ss-ink)]">아직 생성된 초안이 없어요</p>
                <p className="max-w-[32ch] text-[13px] leading-5 text-[var(--ss-mute)]">
                  왼쪽에서 핵심 내용과 톤앤매너를 입력한 뒤 &quot;AI 초안 생성하기&quot;를 눌러주세요.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <CardHead title="한국어 초안" desc="AI가 생성한 원문입니다. 자유롭게 수정할 수 있어요." />
                  <div className="flex flex-col gap-3">
                    <Field label="제목">
                      <Input value={koDraft.title} onChange={(next) => setKoDraft({ ...koDraft, title: next })} />
                    </Field>
                    <Field label="본문">
                      <textarea
                        value={koDraft.body}
                        onChange={(e) => setKoDraft({ ...koDraft, body: e.target.value })}
                        rows={3}
                        className={TEXTAREA_CLASS}
                      />
                    </Field>
                  </div>
                </div>

                {selectedLanguages.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Translate size={15} className="text-[var(--ss-mute)]" />
                      <h3 className="text-[13px] font-medium text-[var(--ss-mute)]">다국어 번역 ({selectedLanguages.length})</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      {selectedLanguages.map((language) => {
                        const translation = translations[language];
                        if (!translation) return null;
                        return (
                          <Card key={language} soft className="flex flex-col gap-3">
                            <Badge tone="info">{language}</Badge>
                            <Field label="제목">
                              <Input
                                value={translation.title}
                                onChange={(next) =>
                                  setTranslations((prev) => ({ ...prev, [language]: { ...translation, title: next } }))
                                }
                              />
                            </Field>
                            <Field label="본문">
                              <textarea
                                value={translation.body}
                                onChange={(e) =>
                                  setTranslations((prev) => ({ ...prev, [language]: { ...translation, body: e.target.value } }))
                                }
                                rows={3}
                                className={TEXTAREA_CLASS}
                              />
                            </Field>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 border-t border-[var(--ss-hairline)] pt-5">
                  <Button icon={<Sparkle size={15} weight="fill" />} onClick={handlePublish}>
                    CMS에 즉시 게시
                  </Button>
                  {published && <Badge tone="positive" dot>게시되었습니다</Badge>}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Card>
        <CardHead title="최근 생성 이력" desc="AI가 최근에 작성한 콘텐츠 초안 목록입니다" />
        <Table head={["원본 제목", "콘텐츠 종류", "톤앤매너", "번역 언어", "생성일시"]} minWidth={620}>
          {AI_DRAFTS.map((draft) => (
            <Row key={draft.id}>
              <Cell strong>{draft.sourceTitle}</Cell>
              <Cell muted>{CONTENT_KIND_LABEL[draft.kind]}</Cell>
              <Cell>
                <Badge>{draft.tone}</Badge>
              </Cell>
              <Cell muted>{draft.targetLanguages.length}개 언어</Cell>
              <Cell mono muted nowrap>
                {dateTime(draft.createdAt)}
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>
    </div>
  );
}
