"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/projects/camera/colorrecipe/styles/colorrecipe.css";
import { PhoneFrame } from "@/components/shared/phone-frame";
import { blankRecipe, getRecipe, recipes } from "@/projects/camera/colorrecipe/lib/recipes";
import { getPhoto, photos } from "@/projects/camera/colorrecipe/lib/photos";
import type { ColorRecipeScreen } from "@/projects/camera/colorrecipe/lib/navigation";
import {
  OnboardingScreen,
  type OnboardingStep,
} from "@/projects/camera/colorrecipe/components/screens/onboarding-screen";
import { HomeScreen } from "@/projects/camera/colorrecipe/components/screens/home-screen";
import { CameraScreen } from "@/projects/camera/colorrecipe/components/screens/camera-screen";
import { RecipesScreen } from "@/projects/camera/colorrecipe/components/screens/recipes-screen";
import { RecipeDetailScreen } from "@/projects/camera/colorrecipe/components/screens/recipe-detail-screen";
import { RecipeEditorScreen } from "@/projects/camera/colorrecipe/components/screens/recipe-editor-screen";
import { PhotoDetailScreen } from "@/projects/camera/colorrecipe/components/screens/photo-detail-screen";
import { SettingsScreen } from "@/projects/camera/colorrecipe/components/screens/settings-screen";

const SCREENS: ColorRecipeScreen[] = [
  "onboarding",
  "home",
  "camera",
  "recipes",
  "recipeDetail",
  "recipeEditor",
  "photoDetail",
  "settings",
];

const ONBOARDING_STEPS: OnboardingStep[] = ["intro", "features", "permissions", "auth"];

// Screenshot capture convention: `?screen=onboarding-<step>` (e.g.
// `onboarding-permissions`) jumps straight to that onboarding step, since
// onboarding's steps live in local state rather than being separate
// top-level screens. See scripts/capture-screenshot.ts.
function getInitialScreen(param: string | null): ColorRecipeScreen {
  if (param?.startsWith("onboarding-")) return "onboarding";
  return SCREENS.includes(param as ColorRecipeScreen) ? (param as ColorRecipeScreen) : "onboarding";
}

function getInitialOnboardingStep(param: string | null): OnboardingStep {
  const step = param?.startsWith("onboarding-") ? param.slice("onboarding-".length) : null;
  return ONBOARDING_STEPS.includes(step as OnboardingStep) ? (step as OnboardingStep) : "intro";
}

export default function ColorRecipe() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<ColorRecipeScreen>(() =>
    getInitialScreen(searchParams.get("screen")),
  );
  const [initialOnboardingStep] = useState<OnboardingStep>(() =>
    getInitialOnboardingStep(searchParams.get("screen")),
  );
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0].id);
  const [selectedPhotoId, setSelectedPhotoId] = useState(photos[0].id);
  const [draftRecipeId, setDraftRecipeId] = useState<string | null>(null);

  function navigate(next: ColorRecipeScreen, params?: { recipeId?: string; photoId?: string }) {
    if (params?.recipeId) setSelectedRecipeId(params.recipeId);
    if (params?.photoId) setSelectedPhotoId(params.photoId);
    if (next === "recipeEditor") {
      setDraftRecipeId(params?.recipeId ?? null);
    }
    setScreen(next);
  }

  const selectedRecipe = getRecipe(selectedRecipeId) ?? recipes[0];
  const selectedPhoto = getPhoto(selectedPhotoId) ?? photos[0];
  const editorRecipe = draftRecipeId ? (getRecipe(draftRecipeId) ?? blankRecipe()) : blankRecipe();

  return (
    <PhoneFrame
      backdropClassName="bg-white"
      screenClassName="colorrecipe bg-[var(--cr-bg)] text-[var(--cr-foreground)]"
      statusBarClassName="text-[var(--cr-foreground)]"
      homeIndicatorClassName="bg-[var(--cr-foreground)]/85"
    >
      {screen === "onboarding" && (
        <OnboardingScreen onNavigate={navigate} initialStep={initialOnboardingStep} />
      )}
      {screen === "home" && <HomeScreen onNavigate={navigate} />}
      {screen === "camera" && <CameraScreen onNavigate={navigate} />}
      {screen === "recipes" && <RecipesScreen onNavigate={navigate} />}
      {screen === "recipeDetail" && (
        <RecipeDetailScreen recipe={selectedRecipe} onNavigate={navigate} />
      )}
      {screen === "recipeEditor" && (
        <RecipeEditorScreen
          recipe={editorRecipe}
          isNew={!draftRecipeId}
          onNavigate={navigate}
        />
      )}
      {screen === "photoDetail" && (
        <PhotoDetailScreen photo={selectedPhoto} onNavigate={navigate} />
      )}
      {screen === "settings" && <SettingsScreen onNavigate={navigate} />}
    </PhoneFrame>
  );
}
