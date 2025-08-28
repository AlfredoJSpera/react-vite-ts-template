import { useContext } from "react";
import {
	ThemeContextDataWithoutCustom,
	ThemeContextWithoutCustom,
} from "../theme/ThemeContextWithoutCustom";

export function useThemeContext(): ThemeContextDataWithoutCustom {
	const ctx = useContext(ThemeContextWithoutCustom);
	if (!ctx) {
		throw new Error(
			"useThemeContext must be used within a ThemeProvider (wrap your app with ThemeProvider)"
		);
	}
	return ctx;
}
