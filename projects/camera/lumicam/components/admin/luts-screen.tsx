"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { PageHead, Stat, Card, CardHead, Table, Row, Cell, Badge, Button, Drawer, Field, Select, type Tone } from "@/projects/camera/lumicam/components/admin/ui";
import { lutAssets, filterPacks } from "@/projects/camera/lumicam/lib/mock-data";
import { getFilm, picsum } from "@/projects/camera/lumicam/lib/films";
import type { LutStatus } from "@/projects/camera/lumicam/lib/types";
import { GradedPhoto } from "@/projects/camera/lumicam/components/graded-photo";

const STATUS_LABEL: Record<LutStatus, string> = { active: "활성", draft: "초안", disabled: "비활성" };
const STATUS_TONE: Record<LutStatus, Tone> = { active: "accent", draft: "neutral", disabled: "danger" };
const CATEGORIES = ["전체", "데일리", "인물", "자연", "모노", "시네마틱", "실험"];

/** lutAssets.filmId는 정식 필름(films[])뿐 아니라 스토어의 실험적 필터 팩(filterPacks[])도
 *  가리킬 수 있다 — 두 소스를 모두 조회해 이름/미리보기 이미지/그레이딩을 통일해서 돌려준다. */
function resolveLutSource(filmId: string) {
  const film = getFilm(filmId);
  if (film) return { name: film.name, shortName: film.shortName, photoId: film.heroId, grade: film.colorGrade };
  const pack = filterPacks.find((p) => p.id === filmId);
  if (pack) {
    return {
      name: pack.name,
      shortName: pack.name,
      photoId: pack.photoId,
      grade: { filter: pack.previewFilter, grain: 0.15, vignette: 0.08 },
    };
  }
  return { name: filmId, shortName: filmId, photoId: undefined, grade: undefined };
}

export function LutsScreen() {
  const [category, setCategory] = useState("전체");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const items = category === "전체" ? lutAssets : lutAssets.filter((l) => l.category === category);
  const preview = lutAssets.find((l) => l.id === previewId);
  const previewSource = preview ? resolveLutSource(preview.filmId) : undefined;

  const active = lutAssets.filter((l) => l.status === "active").length;
  const draft = lutAssets.filter((l) => l.status === "draft").length;
  const totalKb = lutAssets.reduce((sum, l) => sum + l.sizeKb, 0);

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="필터 엔진"
        title="3D LUT 라이브러리 관리"
        desc="필름 프리셋에 매핑되는 3D LUT 파일을 업로드하고 버전, 카테고리, 활성 상태를 관리합니다."
        actions={
          <Button icon={<Icon icon="solar:upload-minimalistic-linear" width={14} />} onClick={() => setUploadOpen(true)}>
            새 LUT 업로드
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="활성 LUT" value={`${active}개`} />
        <Stat label="초안" value={`${draft}개`} note="검수 대기" />
        <Stat label="전체 용량" value={`${(totalKb / 1024).toFixed(1)}MB`} />
        <Stat label="필름 매핑" value={`${new Set(lutAssets.map((l) => l.filmId)).size}개`} note="고유 필름 수" />
      </div>

      <Card>
        <CardHead
          title="LUT 목록"
          desc="파일명을 누르면 매핑된 필름에 실제 적용된 미리보기를 확인할 수 있습니다."
          action={<Select value={category} options={CATEGORIES} onChange={setCategory} />}
        />
        <Table head={["LUT 파일", "필름 매핑", "카테고리", "버전", "상태", "업데이트"]} minWidth={720}>
          {items.map((lut) => {
            const source = resolveLutSource(lut.filmId);
            return (
              <Row key={lut.id}>
                <Cell strong>
                  <button type="button" onClick={() => setPreviewId(lut.id)} className="text-left hover:underline">
                    <span className="block tabular-nums">{lut.fileName}</span>
                    <span className="mt-0.5 block text-[11px] font-normal text-[var(--lc-mute)]">{lut.sizeKb}KB</span>
                  </button>
                </Cell>
                <Cell>{source.shortName}</Cell>
                <Cell muted>{lut.category}</Cell>
                <Cell mono muted>
                  {lut.version}
                </Cell>
                <Cell>
                  <Badge tone={STATUS_TONE[lut.status]}>{STATUS_LABEL[lut.status]}</Badge>
                </Cell>
                <Cell muted>
                  <span className="block">{lut.updatedAt}</span>
                  <span className="mt-0.5 block text-[11px]">{lut.uploadedBy}</span>
                </Cell>
              </Row>
            );
          })}
        </Table>
      </Card>

      <Drawer
        open={!!preview}
        onClose={() => setPreviewId(null)}
        title={preview?.fileName ?? ""}
        subtitle={previewSource ? `${previewSource.name} | ${preview?.category}` : undefined}
      >
        {preview && previewSource && (
          <div className="space-y-4">
            <div className="h-56 w-full overflow-hidden rounded-[12px] border border-[var(--lc-border)]">
              {previewSource.photoId !== undefined && previewSource.grade ? (
                <GradedPhoto
                  src={picsum(previewSource.photoId, 500, 400)}
                  alt={`${previewSource.name} LUT 미리보기`}
                  grade={previewSource.grade}
                  className="h-full w-full"
                  sizes="440px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[12.5px] text-[var(--lc-mute)]">
                  미리보기 이미지 없음
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12.5px]">
              <div>
                <p className="text-[var(--lc-mute)]">버전</p>
                <p className="mt-0.5 font-medium text-[var(--lc-ink)] tabular-nums">{preview.version}</p>
              </div>
              <div>
                <p className="text-[var(--lc-mute)]">상태</p>
                <p className="mt-0.5">
                  <Badge tone={STATUS_TONE[preview.status]}>{STATUS_LABEL[preview.status]}</Badge>
                </p>
              </div>
              <div>
                <p className="text-[var(--lc-mute)]">업로더</p>
                <p className="mt-0.5 font-medium text-[var(--lc-ink)]">{preview.uploadedBy}</p>
              </div>
              <div>
                <p className="text-[var(--lc-mute)]">업데이트</p>
                <p className="mt-0.5 font-medium text-[var(--lc-ink)] tabular-nums">{preview.updatedAt}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="새 LUT 업로드"
        subtitle="3D LUT 파일(.cube)을 등록합니다"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setUploadOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setUploadOpen(false)}>업로드</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="LUT 파일">
            <button
              type="button"
              className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[var(--lc-border)] text-[12.5px] text-[var(--lc-mute)]"
            >
              <Icon icon="solar:add-circle-linear" width={18} />
              .cube 파일을 선택하거나 끌어다 놓으세요
            </button>
          </Field>
          <Field label="필름 매핑">
            <Select value="Sunlit Gold 200" options={["Sunlit Gold 200", "Cream Portrait 400", "Harbor Teal 100", "Slate Mono 400", "Dusk Cinema"]} onChange={() => {}} />
          </Field>
          <Field label="카테고리">
            <Select value="데일리" options={CATEGORIES.filter((c) => c !== "전체")} onChange={() => {}} />
          </Field>
          <Field label="버전">
            <input
              defaultValue="v1.0"
              className="h-10 w-full rounded-[6px] border border-[var(--lc-border)] bg-[var(--lc-surface)] px-3 text-[13px] outline-none"
            />
          </Field>
        </div>
      </Drawer>
    </div>
  );
}
