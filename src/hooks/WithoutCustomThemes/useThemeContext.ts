import { useContext } from "react";
import {
	ThemeContext,
	ThemeContextData,
} from "../../theme/WithoutCustomThemes/ThemeContext";

export function useThemeContext(): ThemeContextData {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error(
			"useThemeContext must be used within a ThemeProvider (wrap your app with ThemeProvider)"
		);
	}
	return ctx;
}
