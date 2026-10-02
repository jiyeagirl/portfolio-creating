"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { PhoneFrame } from "@/components/shared/phone-frame";
import "@/projects/commerce/snowpeak/styles/snowpeak.css";
import type { NavigateFn, SnowPeakView } from "@/projects/commerce/snowpeak/lib/navigation";
import { ALL_VIEWS, TAB_OF_VIEW, TAB_ROOTS } from "@/projects/commerce/snowpeak/lib/navigation";
import { NOTIFICATIONS, RESERVATIONS, USER_PROFILE } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { AppNotification, CartItem, Reservation, UserProfile } from "@/projects/commerce/snowpeak/lib/types";
import { BottomNav } from "@/projects/commerce/snowpeak/components/bottom-nav";
import { LoginScreen } from "@/projects/commerce/snowpeak/components/screens/login-screen";
import { SignupScreen } from "@/projects/commerce/snowpeak/components/screens/signup-screen";
import { FindAccountScreen } from "@/projects/commerce/snowpeak/components/screens/find-account-screen";
import { HomeScreen } from "@/projects/commerce/snowpeak/components/screens/home-screen";
import { BookHubScreen } from "@/projects/commerce/snowpeak/components/screens/book-hub-screen";
import { RoomListScreen } from "@/projects/commerce/snowpeak/components/screens/room-list-screen";
import { RoomDetailScreen } from "@/projects/commerce/snowpeak/components/screens/room-detail-screen";
import { LiftSeasonScreen } from "@/projects/commerce/snowpeak/components/screens/lift-season-screen";
import { RentalScreen } from "@/projects/commerce/snowpeak/components/screens/rental-screen";
import { PackageScreen } from "@/projects/commerce/snowpeak/components/screens/package-screen";
import { CartScreen } from "@/projects/commerce/snowpeak/components/screens/cart-screen";
import { PaymentScreen } from "@/projects/commerce/snowpeak/components/screens/payment-screen";
import { BookingCompleteScreen } from "@/projects/commerce/snowpeak/components/screens/booking-complete-screen";
import { MypageScreen } from "@/projects/commerce/snowpeak/components/screens/mypage-screen";
import { ReservationListScreen } from "@/projects/commerce/snowpeak/components/screens/reservation-list-screen";
import { ReservationDetailScreen } from "@/projects/commerce/snowpeak/components/screens/reservation-detail-screen";
import { WalletScreen } from "@/projects/commerce/snowpeak/components/screens/wallet-screen";
import { ProfileEditScreen } from "@/projects/commerce/snowpeak/components/screens/profile-edit-screen";
import { NotificationsScreen } from "@/projects/commerce/snowpeak/components/screens/notifications-screen";
import { SupportScreen } from "@/projects/commerce/snowpeak/components/screens/support-screen";

/* 스크린샷 도구용 진입점. `?screen=home` 형태를 읽는다. */
const subscribeToNothing = () => () => {};

export default function SnowPeak() {
  const search = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.search,
    () => "",
  );
  const initial = useMemo(() => {
    const params = new URLSearchParams(search);
    const screen = params.get("screen");
    return {
      view: screen && ALL_VIEWS.includes(screen as SnowPeakView) ? (screen as SnowPeakView) : ("login" as SnowPeakView),
      id: params.get("id") ?? undefined,
    };
  }, [search]);

  const [nav, setNav] = useState<{ view: SnowPeakView; id?: string } | null>(null);
  const view = nav?.view ?? initial.view;
  const selectedId = nav ? nav.id : initial.id;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>(RESERVATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS);
  const [profile, setProfile] = useState<UserProfile>(USER_PROFILE);

  const rootRef = useRef<HTMLDivElement>(null);

  /* 화면을 바꾸면 기기 안쪽 스크롤을 맨 위로 되돌린다. */
  useEffect(() => {
    rootRef.current?.parentElement?.scrollTo({ top: 0, behavior: "auto" });
  }, [view, selectedId]);

  const navigate: NavigateFn = (nextView, id) => {
    setNav({ view: nextView, id });
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    setCart((prev) => prev.map((c) => (c.cartId === cartId ? { ...c, quantity } : c)));
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((c) => c.cartId !== cartId));
  };

  const placeReservation = (reservation: Reservation) => {
    setReservations((prev) => [reservation, ...prev]);
    setCart([]);
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: "취소" } : r)));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const updateProfile = (next: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...next }));
  };

  const showTabs = TAB_ROOTS.includes(view);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PhoneFrame
      screenClassName="snowpeak bg-[var(--sp-bg)] text-[var(--sp-ink)]"
      statusBarClassName="text-[var(--sp-ink)]"
      homeIndicatorClassName="bg-[var(--sp-ink)]/70"
    >
      <div ref={rootRef} className="min-h-full">
        {view === "login" && <LoginScreen onNavigate={navigate} />}
        {view === "signup" && <SignupScreen onNavigate={navigate} />}
        {view === "findAccount" && <FindAccountScreen onNavigate={navigate} />}

        {view === "home" && <HomeScreen onNavigate={navigate} />}
        {view === "bookHub" && <BookHubScreen onNavigate={navigate} />}

        {view === "roomList" && <RoomListScreen onNavigate={navigate} />}
        {view === "roomDetail" && (
          <RoomDetailScreen roomId={selectedId ?? ""} onNavigate={navigate} onAddToCart={addToCart} />
        )}

        {view === "liftSeason" && <LiftSeasonScreen onNavigate={navigate} onAddToCart={addToCart} />}
        {view === "rental" && <RentalScreen onNavigate={navigate} onAddToCart={addToCart} />}
        {view === "package" && (
          <PackageScreen packageId={selectedId} onNavigate={navigate} onAddToCart={addToCart} />
        )}

        {view === "cart" && (
          <CartScreen
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onNavigate={navigate}
          />
        )}
        {view === "payment" && (
          <PaymentScreen cart={cart} onNavigate={navigate} onPlaceReservation={placeReservation} />
        )}
        {view === "bookingComplete" && (
          <BookingCompleteScreen reservationId={selectedId} reservations={reservations} onNavigate={navigate} />
        )}

        {view === "mypage" && <MypageScreen profile={profile} onNavigate={navigate} />}
        {view === "reservationList" && <ReservationListScreen reservations={reservations} onNavigate={navigate} />}
        {view === "reservationDetail" && (
          <ReservationDetailScreen
            reservationId={selectedId}
            reservations={reservations}
            onNavigate={navigate}
            onCancelReservation={cancelReservation}
          />
        )}
        {view === "wallet" && <WalletScreen profile={profile} onNavigate={navigate} />}
        {view === "profileEdit" && (
          <ProfileEditScreen profile={profile} onNavigate={navigate} onUpdateProfile={updateProfile} />
        )}
        {view === "notifications" && (
          <NotificationsScreen notifications={notifications} onNavigate={navigate} onMarkRead={markNotificationRead} />
        )}
        {view === "support" && <SupportScreen onNavigate={navigate} />}
      </div>

      {showTabs && <BottomNav active={TAB_OF_VIEW[view]!} cartCount={cartCount} onNavigate={navigate} />}
    </PhoneFrame>
  );
}
