"use client";

import { useState } from "react";
import { PencilSimple, WarningCircle } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Button, Card, Field, Input, PetAvatar, SectionHead, Toggle } from "@/projects/monitoring/petlive/components/ui";
import { CURRENT_USER, PETS } from "@/projects/monitoring/petlive/lib/mock-data";
import type { Navigate } from "@/projects/monitoring/petlive/lib/navigation";

const SPECIES_LABEL: Record<string, string> = {
  dog: "강아지",
  cat: "고양이",
};

const CURRENT_YEAR = 2026;

export function MyPageScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [phone, setPhone] = useState(CURRENT_USER.phone);

  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petMemo, setPetMemo] = useState<Record<string, string>>(
    Object.fromEntries(PETS.map((pet) => [pet.id, pet.memo])),
  );
  const [petWeight, setPetWeight] = useState<Record<string, string>>(
    Object.fromEntries(PETS.map((pet) => [pet.id, String(pet.weightKg)])),
  );

  const [notifyMotion, setNotifyMotion] = useState(CURRENT_USER.notifyMotion);
  const [notifySound, setNotifySound] = useState(CURRENT_USER.notifySound);
  const [notifyDevice, setNotifyDevice] = useState(CURRENT_USER.notifyDevice);

  const [showWithdrawNotice, setShowWithdrawNotice] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        onBack={() => onNavigate("home")}
        title="마이페이지"
        className="bg-[var(--pl-canvas)] border-[var(--pl-hairline)]"
        titleClassName="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--pl-ink)]"
      />

      <div className="pl-enter flex-1 overflow-y-auto px-5 pb-10 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 프로필 요약 */}
        <Card padded>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[20px] font-bold leading-[26px] tracking-[-0.01em] text-[var(--pl-ink)]">
                {name}
              </p>
              <p className="mt-1 truncate text-[13px] text-[var(--pl-mute)]">{email}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingProfile((prev) => !prev)}
              className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[13px] font-medium text-[var(--pl-accent-active)]"
            >
              <PencilSimple size={13} weight="bold" />
              회원 정보 수정
            </button>
          </div>

          {editingProfile && (
            <div className="mt-5 space-y-4 border-t border-[var(--pl-hairline)] pt-5">
              <Field label="이름">
                <Input value={name} onChange={setName} placeholder="이름" />
              </Field>
              <Field label="이메일">
                <Input value={email} onChange={setEmail} placeholder="이메일" type="email" />
              </Field>
              <Field label="전화번호">
                <Input value={phone} onChange={setPhone} placeholder="전화번호" />
              </Field>
              <Button full size="md" onClick={() => setEditingProfile(false)}>
                저장
              </Button>
            </div>
          )}
        </Card>

        {/* 반려동물 정보 */}
        <div className="mt-7">
          <SectionHead title="반려동물 정보" />
          <div className="space-y-3">
            {PETS.map((pet) => {
              const editing = editingPetId === pet.id;
              const age = CURRENT_YEAR - pet.birthYear;
              return (
                <Card key={pet.id} soft padded>
                  <div className="flex items-center gap-3">
                    <PetAvatar src={pet.avatar} alt={pet.name} size={52} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-semibold text-[var(--pl-ink)]">{pet.name}</p>
                      <p className="mt-0.5 truncate text-[12.5px] text-[var(--pl-mute)]">
                        {SPECIES_LABEL[pet.species] ?? pet.species} | {pet.breed}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-[var(--pl-mute)]">
                        {age}살 | {petWeight[pet.id]}kg
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPetId(editing ? null : pet.id)}
                      className="shrink-0 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-[var(--pl-accent-active)]"
                    >
                      수정
                    </button>
                  </div>

                  {editing && (
                    <div className="mt-4 space-y-4 border-t border-[var(--pl-hairline)] pt-4">
                      <Field label="몸무게 (kg)">
                        <Input
                          value={petWeight[pet.id]}
                          onChange={(next) => setPetWeight((prev) => ({ ...prev, [pet.id]: next }))}
                          placeholder="몸무게"
                          type="number"
                        />
                      </Field>
                      <Field label="메모">
                        <Input
                          value={petMemo[pet.id]}
                          onChange={(next) => setPetMemo((prev) => ({ ...prev, [pet.id]: next }))}
                          placeholder="메모"
                        />
                      </Field>
                      <Button full size="sm" onClick={() => setEditingPetId(null)}>
                        저장
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="mt-7">
          <SectionHead title="알림 설정" />
          <Card padded className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[14.5px] font-medium text-[var(--pl-ink)]">움직임 감지 알림</span>
              <Toggle on={notifyMotion} onChange={() => setNotifyMotion((prev) => !prev)} label="움직임 감지 알림" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14.5px] font-medium text-[var(--pl-ink)]">소리 감지 알림</span>
              <Toggle on={notifySound} onChange={() => setNotifySound((prev) => !prev)} label="소리 감지 알림" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14.5px] font-medium text-[var(--pl-ink)]">디바이스 상태 알림</span>
              <Toggle on={notifyDevice} onChange={() => setNotifyDevice((prev) => !prev)} label="디바이스 상태 알림" />
            </div>
          </Card>
        </div>

        {/* 계정 */}
        <div className="mt-7">
          <SectionHead title="계정" />
          <Card padded>
            <Button full variant="secondary" onClick={() => onNavigate("login")}>
              로그아웃
            </Button>
          </Card>
          <div className="mt-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowWithdrawNotice((prev) => !prev)}
              className="text-[12.5px] font-medium text-[var(--pl-negative)]"
            >
              회원 탈퇴
            </button>
            {showWithdrawNotice && (
              <p className="mt-2 flex items-center gap-1 text-[11.5px] leading-4 text-[var(--pl-mute)]">
                <WarningCircle size={12} weight="bold" />
                회원 탈퇴는 고객센터를 통해 처리됩니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
