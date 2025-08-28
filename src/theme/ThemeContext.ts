import { createContext } from "react";
import { Theme } from "../types/Theme";

export interface ThemeContextData {
	currentTheme: Theme;
	applyNewCurrentTheme: (theme: Theme) => void;
	customThemes: Theme[];
	saveCustomTheme: (
		name: string,
		customVariables: Record<string, string>
	) => void;
	editCustomTheme: (
		name: string,
		customVariables: Record<string, string>
	) => void;
	deleteCustomTheme: (name: string) => void;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(
	undefined
);
