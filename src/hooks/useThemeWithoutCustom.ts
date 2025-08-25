import { useCallback, useEffect } from "react";
import useLocalStorageState from "./useLocalStorageState";
import { Theme, DEFAULT_THEME } from "../theme/theme";

interface UseThemeResult {
	currentTheme: Theme;
	applyNewCurrentTheme: (theme: Theme) => void;
}

/**
 * A hook for managing the application's theme that stores information in the localStorage.
 */
function useThemeWithoutCustom(): UseThemeResult {
	const [currentTheme, setCurrentTheme] = useLocalStorageState<Theme>(
		"theme",
		DEFAULT_THEME
	);

	// Synchronize the theme state with the DOM when the theme changes
	useEffect(() => {
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
