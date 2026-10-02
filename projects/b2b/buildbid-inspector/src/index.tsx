"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/b2b/buildbid-inspector/styles/inspector.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import {
  JOBS,
  buildChecklist,
  EQUIPMENT_PHOTO_POOL,
} from "@/projects/b2b/buildbid-inspector/lib/mock-data";
import {
  WIZARD_STEPS,
  type InspectorScreen,
  type WizardStep,
} from "@/projects/b2b/buildbid-inspector/lib/navigation";
import {
  createEmptyReport,
  type CapturedPhoto,
  type ChecklistItem,
  type DamageRecord,
  type Grade,
  type InspectionJob,
  type InspectionReport,
} from "@/projects/b2b/buildbid-inspector/lib/types";
import { ScheduleScreen } from "@/projects/b2b/buildbid-inspector/components/schedule/schedule-screen";
import { JobDetailScreen } from "@/projects/b2b/buildbid-inspector/components/schedule/job-detail-screen";
import { WizardShell } from "@/projects/b2b/buildbid-inspector/components/wizard/wizard-shell";
import { ChecklistStep } from "@/projects/b2b/buildbid-inspector/components/wizard/checklist-step";
import { PhotosStep } from "@/projects/b2b/buildbid-inspector/components/wizard/photos-step";
import { DamageStep } from "@/projects/b2b/buildbid-inspector/components/wizard/damage-step";
import { NotesStep } from "@/projects/b2b/buildbid-inspector/components/wizard/notes-step";
import { GradeStep } from "@/projects/b2b/buildbid-inspector/components/wizard/grade-step";
import { ReviewStep } from "@/projects/b2b/buildbid-inspector/components/wizard/review-step";
import { SubmittedScreen } from "@/projects/b2b/buildbid-inspector/components/submitted-screen";

const SCREEN_KEYS: InspectorScreen[] = ["schedule", "jobDetail", "wizard", "submitted"];
const DEMO_JOB_ID = "job-2"; // 진행중 상태 — 스크린샷 툴이 ?screen=... 으로 직행할 때 쓰는 대표 잡

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Screenshot tooling (scripts/capture-screenshot.ts) requests a specific
// screen via `?screen=<name>` and, for the wizard, an optional
// `?step=<name>`. Read once at mount; in-app navigation drives state
// afterwards. A query-param landing on wizard/submitted seeds a
// semi-filled demo report so the captured screen isn't empty — normal
// interactive use (tapping "검수 시작") always starts from a blank report.
function getInitialState(
  screenParam: string | null,
  stepParam: string | null,
): {
  screen: InspectorScreen;
  jobId: string | null;
  step: WizardStep;
  report: InspectionReport | null;
} {
  const screen = SCREEN_KEYS.includes(screenParam as InspectorScreen)
    ? (screenParam as InspectorScreen)
    : "schedule";

  if (screen === "schedule") {
    return { screen, jobId: null, step: "checklist", report: null };
  }

  const step = WIZARD_STEPS.includes(stepParam as WizardStep) ? (stepParam as WizardStep) : "checklist";

  if (screen === "jobDetail") {
    return { screen, jobId: DEMO_JOB_ID, step, report: null };
  }

  // wizard / submitted need a populated report so every step screenshots well
  return { screen, jobId: DEMO_JOB_ID, step, report: buildDemoReport() };
}

function buildDemoReport(): InspectionReport {
  const checklist = buildChecklist().map((item, i) => {
    if (i % 9 === 8) return { ...item, result: "불량" as const, memo: "정비 필요, 견적 확인 요청" };
    if (i % 5 === 4) return { ...item, result: "주의" as const, memo: "경미한 마모 관찰됨" };
    return { ...item, result: "정상" as const };
  });
  const photos: CapturedPhoto[] = EQUIPMENT_PHOTO_POOL.slice(0, 4).map((p, i) => ({
    id: `demo-photo-${i}`,
    picsumId: p.picsumId,
    label: p.label,
    capturedAt: addMinutes("09:12", i * 4),
  }));
  const damages: DamageRecord[] = [
    { id: "demo-damage-1", location: "붐 실린더 좌측", severity: "중간", memo: "유압 오일 미세 누유 흔적" },
  ];
  return {
    checklist,
    photos,
    damages,
    notes: "| 정기 정비 이력 양호\n| 타이어 교체 필요",
    grade: "B",
    gradeComment: "유압계통 경미한 누유, 외관 스크래치로 B등급 산정",
  };
}

export default function BuildbidInspector() {
  const searchParams = useSearchParams();
  const initial = useMemo(
    () => getInitialState(searchParams.get("screen"), searchParams.get("step")),
    [searchParams],
  );

  const [jobs, setJobs] = useState<InspectionJob[]>(JOBS);
  const [screen, setScreen] = useState<InspectorScreen>(initial.screen);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(initial.jobId);
  const [wizardStep, setWizardStep] = useState<WizardStep>(initial.step);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [report, setReport] = useState<InspectionReport | null>(initial.report);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;
  const stepIndex = WIZARD_STEPS.indexOf(wizardStep);

  function selectJob(jobId: string) {
    setSelectedJobId(jobId);
    setScreen("jobDetail");
  }

  function backToSchedule() {
    setScreen("schedule");
  }

  function startInspection() {
    setReport(createEmptyReport(buildChecklist()));
    setWizardStep("checklist");
    setDirection(1);
    setScreen("wizard");
  }

  function exitWizard() {
    setScreen("jobDetail");
  }

  function goToStep(step: WizardStep, dir: 1 | -1) {
    setDirection(dir);
    setWizardStep(step);
  }

  function wizardBack() {
    if (stepIndex === 0) {
      exitWizard();
      return;
    }
    goToStep(WIZARD_STEPS[stepIndex - 1], -1);
  }

  function wizardNext() {
    if (stepIndex < WIZARD_STEPS.length - 1) {
      goToStep(WIZARD_STEPS[stepIndex + 1], 1);
    }
  }

  function jumpToStep(step: WizardStep) {
    const targetIndex = WIZARD_STEPS.indexOf(step);
    setDirection(targetIndex >= stepIndex ? 1 : -1);
    setWizardStep(step);
  }

  function updateChecklistItem(id: string, patch: Partial<ChecklistItem>) {
    setReport((prev) =>
      prev
        ? { ...prev, checklist: prev.checklist.map((c) => (c.id === id ? { ...c, ...patch } : c)) }
        : prev,
    );
  }

  function addPhoto() {
    setReport((prev) => {
      if (!prev) return prev;
      const usedIds = new Set(prev.photos.map((p) => p.picsumId));
      const next = EQUIPMENT_PHOTO_POOL.find((p) => !usedIds.has(p.picsumId)) ?? EQUIPMENT_PHOTO_POOL[prev.photos.length % EQUIPMENT_PHOTO_POOL.length];
      const captured: CapturedPhoto = {
        id: `photo-${Date.now()}-${prev.photos.length}`,
        picsumId: next.picsumId,
        label: next.label,
        capturedAt: addMinutes(selectedJob?.scheduledTime ?? "09:00", prev.photos.length * 3 + 6),
      };
      return { ...prev, photos: [...prev.photos, captured] };
    });
  }

  function removePhoto(id: string) {
    setReport((prev) => (prev ? { ...prev, photos: prev.photos.filter((p) => p.id !== id) } : prev));
  }

  function addDamage(record: Omit<DamageRecord, "id">) {
    setReport((prev) =>
      prev ? { ...prev, damages: [...prev.damages, { ...record, id: `damage-${Date.now()}` }] } : prev,
    );
  }

  function removeDamage(id: string) {
    setReport((prev) => (prev ? { ...prev, damages: prev.damages.filter((d) => d.id !== id) } : prev));
  }

  function setNotes(notes: string) {
    setReport((prev) => (prev ? { ...prev, notes } : prev));
  }

  function selectGrade(grade: Grade) {
    setReport((prev) => (prev ? { ...prev, grade } : prev));
  }

  function setGradeComment(gradeComment: string) {
    setReport((prev) => (prev ? { ...prev, gradeComment } : prev));
  }

  function submitReport() {
    if (!selectedJob) return;
    const time = addMinutes(selectedJob.scheduledTime, 42);
    setSubmittedAt(time);
    setJobs((prev) => prev.map((j) => (j.id === selectedJob.id ? { ...j, status: "완료" } : j)));
    setScreen("submitted");
  }

  function finishSubmitted() {
    setScreen("schedule");
    setSelectedJobId(null);
    setReport(null);
  }

  return (
    <PhoneFrame screenClassName="buildbid-inspector bg-[var(--bbi-canvas)] text-[var(--bbi-ink)]">
      {screen === "schedule" && <ScheduleScreen onSelectJob={selectJob} />}

      {screen === "jobDetail" && selectedJob && (
        <JobDetailScreen job={selectedJob} onBack={backToSchedule} onStart={startInspection} />
      )}

      {screen === "wizard" && selectedJob && report && (
        <WizardShell
          step={wizardStep}
          direction={direction}
          jobLabel={`${selectedJob.equipmentType} | ${selectedJob.companyName}`}
          onExit={exitWizard}
          onBackStep={wizardBack}
          onNextStep={wizardNext}
          nextLabel={wizardStep === "review" ? "검수 완료 제출" : "다음"}
          nextDisabled={wizardStep === "checklist" && report.checklist.some((c) => c.result === null)}
          footer={
            wizardStep === "review" ? (
              <button
                type="button"
                onClick={submitReport}
                className="bbi-btn-press flex h-[52px] w-full items-center justify-center rounded-[9999px] bg-[var(--bbi-accent)] text-[15px] font-bold text-[var(--bbi-on-accent)]"
              >
                검수 완료 제출
              </button>
            ) : undefined
          }
        >
          {wizardStep === "checklist" && (
            <ChecklistStep checklist={report.checklist} onUpdate={updateChecklistItem} />
          )}
          {wizardStep === "photos" && (
            <PhotosStep
              photos={report.photos}
              canAddMore={report.photos.length < EQUIPMENT_PHOTO_POOL.length}
              onAdd={addPhoto}
              onRemove={removePhoto}
            />
          )}
          {wizardStep === "damage" && (
            <DamageStep damages={report.damages} onAdd={addDamage} onRemove={removeDamage} />
          )}
          {wizardStep === "notes" && <NotesStep notes={report.notes} onChange={setNotes} />}
          {wizardStep === "grade" && (
            <GradeStep
              grade={report.grade}
              gradeComment={report.gradeComment}
              onSelectGrade={selectGrade}
              onCommentChange={setGradeComment}
            />
          )}
          {wizardStep === "review" && (
            <ReviewStep job={selectedJob} report={report} onJump={jumpToStep} />
          )}
        </WizardShell>
      )}

      {screen === "submitted" && selectedJob && report && (
        <SubmittedScreen
          job={selectedJob}
          report={report}
          submittedAt={submittedAt ?? selectedJob.scheduledTime}
          onDone={finishSubmitted}
        />
      )}
    </PhoneFrame>
  );
}
