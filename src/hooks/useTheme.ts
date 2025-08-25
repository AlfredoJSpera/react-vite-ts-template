import { useCallback, useEffect } from "react";
import useLocalStorageState from "./useLocalStorageState";
import { Theme, DEFAULT_THEME } from "../theme/theme";

interface UseThemeResult {
	currentTheme: Theme;
	applyNewCurrentTheme: (theme: Theme) => void;

	//! Delete if unnecessary
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
	//! ---------------------
}

//! Delete if unnecessary
/** Applies custom CSS variables to the document's HTML element. */
function setCustomVariables(variables: Record<string, string>) {
	for (const [key, value] of Object.entries(variables)) {
		document.documentElement.style.setProperty(key, value);
	}
}

/** Removes custom CSS variables from the document's HTML element. */
function resetCustomVariables() {
	document.documentElement.removeAttribute("style");
}
//! ---------------------

/**
 * A hook for managing the application's theme, by storing information in the localStorage.
 */
export function useTheme(): UseThemeResult {
	const [currentTheme, setCurrentTheme] = useLocalStorageState<Theme>(
		"theme",
		DEFAULT_THEME
	);

	//! Delete if unnecessary
	const [customThemes, setCustomThemes] = useLocalStorageState<Theme[]>(
		"customThemes",
		[]
	);
	//! ---------------------

	// Synchronize the theme state with the DOM when the theme changes
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", currentTheme.name);

		//! Delete if unnecessary
		if (currentTheme.customVariables) {
			setCustomVariables(currentTheme.customVariables);
		} else {
			// Remove any inline styles that might have been applied by custom themes
			resetCustomVariables();
		}
		//! ---------------------
	}, [currentTheme]);

	//! Delete if unnecessary
	const saveCustomTheme = useCallback(
		(name: string, customVariables: Record<string, string>) => {
			const newTheme: Theme = { name, customVariables };
			setCustomThemes((prevThemes) => [...prevThemes, newTheme]);
		},
		[setCustomThemes]
	);

	const editCustomTheme = useCallback(
		(name: string, customVariables: Record<string, string>) => {
			setCustomThemes((prev) =>
				// Create a new array of themes with the selected theme edited
				prev.map((theme) => {
					if (theme.name === name) {
						return { ...theme, customVariables };
					}
					return theme;
				})
			);

			// If editing the current theme, update it too
			if (currentTheme.name === name) {
				setCurrentTheme({ name, customVariables });
			}
		},
		[setCustomThemes, setCurrentTheme, currentTheme]
	);

	const deleteCustomTheme = useCallback(
		(name: string) => {
			setCustomThemes((prev) =>
				// Create a new array of themes without the selected theme
				prev.filter((theme) => theme.name !== name)
			);

			// If deleting the current theme, fall back to DEFAULT_THEME
			if (currentTheme.name === name) {
				setCurrentTheme(DEFAULT_THEME);
			}
		},
		[setCustomThemes, setCurrentTheme, currentTheme]
	);
	//! ---------------------

	const applyNewCurrentTheme = useCallback(
		(newCurrentTheme: Theme) => {
			setCurrentTheme(newCurrentTheme);
		},
		[setCurrentTheme]
	);

	return {
		currentTheme,
		applyNewCurrentTheme,
		//! Delete if unnecessary
		customThemes,
		saveCustomTheme,
		editCustomTheme,
		deleteCustomTheme,
		//! ---------------------
	};
}
