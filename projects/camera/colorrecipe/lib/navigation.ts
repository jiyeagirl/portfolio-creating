export type ColorRecipeScreen =
  | "onboarding"
  | "home"
  | "camera"
  | "recipes"
  | "recipeDetail"
  | "recipeEditor"
  | "photoDetail"
  | "settings";

export type ColorRecipeNavigate = (
  screen: ColorRecipeScreen,
  params?: { recipeId?: string; photoId?: string },
) => void;
