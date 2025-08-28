import { useContext } from "react";
import { ThemeContextData } from "../theme/ThemeContext";
import { ThemeContext } from "../theme/ThemeContext";

export function useThemeContext(): ThemeContextData {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error(
			"useThemeContext must be used within a ThemeProvider (wrap your app with ThemeProvider)"
		);
	}
	return ctx;
}
