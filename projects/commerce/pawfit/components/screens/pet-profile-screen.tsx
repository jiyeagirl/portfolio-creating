"use client";

import { useState } from "react";
import { Camera, Check, PawPrint, Plus } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";
import type { Pet } from "@/projects/commerce/pawfit/lib/types";
import { PETS } from "@/projects/commerce/pawfit/lib/mock-data";
import { AppBar, Badge, Field, GhostButton, PetAvatar, PrimaryButton, inputClass } from "@/projects/commerce/pawfit/components/ui";

type EditForm = {
  name: string;
  breed: string;
  gender: "수컷" | "암컷";
  birthDate: string;
  weightKg: string;
  backLengthCm: string;
  chestGirthCm: string;
  neckCm: string;
};

const BLANK_FORM: EditForm = {
  name: "",
  breed: "",
  gender: "수컷",
  birthDate: "",
  weightKg: "",
  backLengthCm: "",
  chestGirthCm: "",
  neckCm: "",
};

function formFromPet(pet: Pet): EditForm {
  return {
    name: pet.name,
    breed: pet.breed,
    gender: pet.gender,
    birthDate: pet.birthDate,
    weightKg: String(pet.weightKg),
    backLengthCm: String(pet.backLengthCm),
    chestGirthCm: String(pet.chestGirthCm),
    neckCm: String(pet.neckCm),
  };
}

function GenderToggle({
  value,
  onChange,
}: {
  value: "수컷" | "암컷";
  onChange: (g: "수컷" | "암컷") => void;
}) {
  return (
    <div className="flex gap-2">
      {(["수컷", "암컷"] as const).map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          aria-pressed={value === g}
          className={`flex-1 rounded-full border py-2.5 text-[13px] font-semibold transition-colors ${
            value === g
              ? "border-[var(--pf-ink)] bg-[var(--pf-ink)] text-white"
              : "border-[var(--pf-hairline)] bg-[var(--pf-canvas)] text-[var(--pf-muted)]"
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  );
}

function BodyFieldsForm({
  form,
  setForm,
}: {
  form: EditForm;
  setForm: (updater: (prev: EditForm) => EditForm) => void;
}) {
  return (
    <>
      <div>
        <p className="mb-2.5 text-[13px] font-semibold text-[var(--pf-ink)]">기본정보</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="이름">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="반려동물 이름"
              className={inputClass}
            />
          </Field>
          <Field label="품종">
            <input
              value={form.breed}
              onChange={(e) => setForm((prev) => ({ ...prev, breed: e.target.value }))}
              placeholder="예: 비글"
              className={inputClass}
            />
          </Field>
          <div className="col-span-2">
            <Field label="성별">
              <GenderToggle value={form.gender} onChange={(g) => setForm((prev) => ({ ...prev, gender: g }))} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="생년월일">
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm((prev) => ({ ...prev, birthDate: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2.5 text-[13px] font-semibold text-[var(--pf-ink)]">체형 정보</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="몸무게 (kg)">
            <input
              type="number"
              inputMode="decimal"
              value={form.weightKg}
              onChange={(e) => setForm((prev) => ({ ...prev, weightKg: e.target.value }))}
              placeholder="0.0"
              className={`${inputClass} pf-num`}
            />
          </Field>
          <Field label="등길이 (cm)">
            <input
              type="number"
              inputMode="decimal"
              value={form.backLengthCm}
              onChange={(e) => setForm((prev) => ({ ...prev, backLengthCm: e.target.value }))}
              placeholder="0"
              className={`${inputClass} pf-num`}
            />
          </Field>
          <Field label="가슴둘레 (cm)">
            <input
              type="number"
              inputMode="decimal"
              value={form.chestGirthCm}
              onChange={(e) => setForm((prev) => ({ ...prev, chestGirthCm: e.target.value }))}
              placeholder="0"
              className={`${inputClass} pf-num`}
            />
          </Field>
          <Field label="목둘레 (cm)">
            <input
              type="number"
              inputMode="decimal"
              value={form.neckCm}
              onChange={(e) => setForm((prev) => ({ ...prev, neckCm: e.target.value }))}
              placeholder="0"
              className={`${inputClass} pf-num`}
            />
          </Field>
        </div>
      </div>
    </>
  );
}

function PetCard({
  pet,
  isSelected,
  isEditing,
  onToggleEdit,
  onNavigate,
}: {
  pet: Pet;
  isSelected: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  onNavigate: NavigateFn;
}) {
  const [editForm, setEditForm] = useState<EditForm>(() => formFromPet(pet));
  const [photoFlash, setPhotoFlash] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  return (
    <div
      className={`rounded-[16px] border p-4 transition-colors ${
        isSelected ? "border-[var(--pf-ink)]/25 bg-[var(--pf-surface-card)]" : "border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)]"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isEditing) setEditForm(formFromPet(pet));
          setPhotoFlash(false);
          setSavedFlash(false);
          onToggleEdit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggleEdit();
        }}
        className="flex w-full cursor-pointer items-start gap-3 text-left"
      >
        <PetAvatar pet={pet} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[15px] font-semibold">{pet.name}</p>
            <Badge tone="neutral">{pet.gender}</Badge>
          </div>
          <p className="mt-0.5 text-[12.5px] text-[var(--pf-muted)]">
            {pet.breed} | {pet.birthDate.replaceAll("-", ".")}
          </p>
          <div className="mt-3 flex gap-4">
            <div>
              <p className="text-[11px] text-[var(--pf-muted-soft)]">몸무게</p>
              <p className="pf-num mt-0.5 text-[13px] font-semibold">{pet.weightKg}kg</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--pf-muted-soft)]">가슴둘레</p>
              <p className="pf-num mt-0.5 text-[13px] font-semibold">{pet.chestGirthCm}cm</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--pf-muted-soft)]">목둘레</p>
              <p className="pf-num mt-0.5 text-[13px] font-semibold">{pet.neckCm}cm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3.5">
        <PrimaryButton full={false} onClick={() => onNavigate("sizeRecommendation", pet.id)}>
          사이즈 추천 받기
        </PrimaryButton>
      </div>

      {isEditing && (
        <div className="pf-enter mt-4 flex flex-col border-t border-[var(--pf-hairline)] pt-4">
          <BodyFieldsForm form={editForm} setForm={setEditForm} />

          <div className="mt-4">
            <p className="mb-2.5 text-[13px] font-semibold text-[var(--pf-ink)]">프로필 사진</p>
            <div className="flex items-center gap-3">
              <PetAvatar pet={pet} size={56} />
              <GhostButton
                full={false}
                onClick={() => {
                  setPhotoFlash(true);
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Camera size={15} />
                  사진 변경
                </span>
              </GhostButton>
              {photoFlash && (
                <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--pf-success)]">
                  <Check size={13} weight="bold" />
                  변경되었습니다
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-2">
            <PrimaryButton
              onClick={() => {
                setSavedFlash(true);
              }}
            >
              저장
            </PrimaryButton>
            {savedFlash && (
              <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--pf-success)]">
                <Check size={13} weight="bold" />
                저장되었습니다
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RegistrationForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState<EditForm>(BLANK_FORM);
  const [photoFlash, setPhotoFlash] = useState(false);
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pf-success-soft)] text-[var(--pf-success)]">
          <Check size={24} weight="bold" />
        </span>
        <p className="text-[16px] font-semibold">등록되었습니다</p>
        <p className="text-[13px] leading-relaxed text-[var(--pf-muted)]">
          {form.name || "반려동물"}의 프로필이 저장됐어요.
          <br />
          이제 홈에서 바로 선택하고 사이즈를 추천받을 수 있어요.
        </p>
        <div className="mt-2 w-full max-w-[220px]">
          <GhostButton onClick={onDone}>목록으로 돌아가기</GhostButton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-10 pt-5">
      <BodyFieldsForm form={form} setForm={setForm} />

      <div className="mt-4">
        <p className="mb-2.5 text-[13px] font-semibold text-[var(--pf-ink)]">프로필 사진</p>
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[var(--pf-muted)]">
            <PawPrint size={22} weight="duotone" />
          </span>
          <GhostButton full={false} onClick={() => setPhotoFlash(true)}>
            <span className="inline-flex items-center gap-1.5">
              <Camera size={15} />
              사진 등록
            </span>
          </GhostButton>
          {photoFlash && (
            <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--pf-success)]">
              <Check size={13} weight="bold" />
              등록되었습니다
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={() => setSuccess(true)}>등록하기</PrimaryButton>
      </div>
    </div>
  );
}

export function PetProfileScreen({
  selectedPetId,
  onSelectPet,
  onNavigate,
}: {
  selectedPetId: string;
  onSelectPet: (id: string) => void;
  onNavigate: NavigateFn;
}) {
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  if (isRegistering) {
    return (
      <div className="pf-enter pb-10">
        <AppBar title="반려동물 등록" onBack={() => setIsRegistering(false)} />
        <RegistrationForm onDone={() => setIsRegistering(false)} />
      </div>
    );
  }

  return (
    <div className="pf-enter pb-10">
      <AppBar
        title="반려동물"
        right={
          <button
            type="button"
            onClick={() => {
              setEditingPetId(null);
              setIsRegistering(true);
            }}
            aria-label="반려동물 등록하기"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pf-hairline)] text-[var(--pf-ink)] transition-transform active:scale-[0.9]"
          >
            <Plus size={16} weight="bold" />
          </button>
        }
      />

      <div className="flex flex-col gap-3 px-5 pt-4">
        {PETS.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            isSelected={pet.id === selectedPetId}
            isEditing={editingPetId === pet.id}
            onToggleEdit={() => {
              onSelectPet(pet.id);
              setEditingPetId((prev) => (prev === pet.id ? null : pet.id));
            }}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
