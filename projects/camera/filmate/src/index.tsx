"use client";

import { useState } from "react";
import "@/projects/camera/filmate/styles/filmate.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { getFilm } from "@/projects/camera/filmate/lib/films";
import type { FilmateScreen } from "@/projects/camera/filmate/lib/navigation";
import { CameraScreen } from "@/projects/camera/filmate/components/screens/camera-screen";
import { FilmRollScreen } from "@/projects/camera/filmate/components/screens/film-roll-screen";
import { FilmDetailScreen } from "@/projects/camera/filmate/components/screens/film-detail-screen";
import { ContactSheetScreen } from "@/projects/camera/filmate/components/screens/contact-sheet-screen";
import { SettingsScreen } from "@/projects/camera/filmate/components/screens/settings-screen";

export default function Filmate() {
  const [screen, setScreen] = useState<FilmateScreen>("camera");
  const [selectedFilmId, setSelectedFilmId] = useState("kodak-gold");

  function navigate(next: FilmateScreen, filmId?: string) {
    if (filmId) setSelectedFilmId(filmId);
    setScreen(next);
  }

  return (
    <PhoneFrame
      backdropClassName="bg-[#1c1a17]"
      backdropGlow
      screenClassName="filmate bg-[var(--fm-bg)] text-[var(--fm-foreground)]"
      statusBarClassName="text-[var(--fm-foreground)]"
      homeIndicatorClassName="bg-[var(--fm-foreground)]/85"
    >
      {screen === "camera" && <CameraScreen onNavigate={navigate} />}
      {screen === "films" && <FilmRollScreen onNavigate={navigate} />}
      {screen === "filmDetail" && (
        <FilmDetailScreen film={getFilm(selectedFilmId)!} onNavigate={navigate} />
      )}
      {screen === "contactSheet" && <ContactSheetScreen onNavigate={navigate} />}
      {screen === "settings" && <SettingsScreen onNavigate={navigate} />}
    </PhoneFrame>
  );
}
