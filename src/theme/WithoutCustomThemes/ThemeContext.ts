import { createContext } from "react";
import { Theme } from "../../types/Theme";

export interface ThemeContextData {
	currentTheme: Theme;
	applyNewCurrentTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(
	undefined
);
