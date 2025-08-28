import { useCallback, useEffect } from "react";
import { Theme, DEFAULT_THEME } from "../theme/theme";
import { useLocalStorage } from "@uidotdev/usehooks";

interface UseThemeResult {
	currentTheme: Theme;
	applyNewCurrentTheme: (theme: Theme) => void;
}

/**
 * A hook for managing the application's theme that stores information in the localStorage.
 */
function useThemeWithoutCustom(): UseThemeResult {
	const [currentTheme, setCurrentTheme] = useLocalStorage<Theme>(
		"theme",
		DEFAULT_THEME
	);

	// Synchronize the theme state with the DOM when the theme changes
	useEffect(() => {
		// Prevent DOM manipulation during server-side rendering (SSR)
		if (typeof document === "undefined") return;

		document.documentElement.setAttribute("data-theme", currentTheme.name);
	}, [currentTheme]);

	const applyNewCurrentTheme = useCallback(
		(newCurrentTheme: Theme) => {
			setCurrentTheme(newCurrentTheme);
		},
		[setCurrentTheme]
	);

	return {
		currentTheme,
		applyNewCurrentTheme,
	};
}

export default useThemeWithoutCustom;
