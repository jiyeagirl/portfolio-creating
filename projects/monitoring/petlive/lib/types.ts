import type { StaticImageData } from "next/image";

export type Species = "dog" | "cat";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  birthYear: number;
  weightKg: number;
  gender: "male" | "female";
  neutered: boolean;
  memo: string;
  /** assets/pets/ 로컬 이미지 import 값 */
  avatar: StaticImageData;
}

export type DeviceStatus = "online" | "offline" | "error";

export interface Device {
  id: string;
  name: string;
  location: string;
  petId: string;
  status: DeviceStatus;
  /** null이면 상시 전원(코드형) 디바이스 */
  batteryPct: number | null;
  wifiPct: number;
  model: string;
  firmwareVersion: string;
  firmwareLatest: string;
  registeredAt: string;
  lastConnectedAt: string;
  errorNote?: string;
  /** assets/pets/ 로컬 이미지 import 값 — 카메라 라이브뷰 썸네일 */
  thumbnail: StaticImageData;
}

export type EventKind = "motion" | "sound";

export interface EventRecord {
  id: string;
  deviceId: string;
  petId: string;
  kind: EventKind;
  occurredAt: string;
  durationSec: number;
  reviewed: boolean;
  /** assets/pets/ 로컬 이미지 import 값 */
  thumbnail: StaticImageData;
  note: string;
}

export interface NotificationItem {
  id: string;
  kind: EventKind | "device" | "system";
  title: string;
  detail: string;
  at: string;
  unread: boolean;
}

export interface MemberUser {
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  autoLogin: boolean;
  notifyMotion: boolean;
  notifySound: boolean;
  notifyDevice: boolean;
}

/* ── 관리자 도메인 ── */

export type MemberStatus = "active" | "inactive";

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: MemberStatus;
  petsCount: number;
  devicesCount: number;
  plan: "무료" | "스탠다드" | "프로";
  lastLoginAt: string;
}

export interface AdminDevice {
  id: string;
  serial: string;
  model: string;
  ownerName: string;
  location: string;
  status: DeviceStatus;
  firmwareVersion: string;
  firmwareLatest: string;
  registeredAt: string;
  lastConnectedAt: string;
  errorNote?: string;
}

export type LogKind = "event" | "login" | "connection" | "error";

export interface LogEntry {
  id: string;
  kind: LogKind;
  message: string;
  actor: string;
  at: string;
  severity: "info" | "warn" | "critical";
}

export interface ErpSyncRecord {
  id: string;
  memberName: string;
  memberEmail: string;
  syncedAt: string;
  status: "synced" | "pending" | "failed";
  field: string;
}
