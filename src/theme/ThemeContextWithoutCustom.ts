import { createContext } from "react";
import { Theme } from "./theme";

export interface ThemeContextDataWithoutCustom {
	currentTheme: Theme;
	applyNewCurrentTheme: (theme: Theme) => void;
}

export const ThemeContextWithoutCustom = createContext<
	ThemeContextDataWithoutCustom | undefined
>(undefined);
