import { useCallback, useEffect } from "react";
import useLocalStorageAsState from "./useLocalStorageAsState";
import { Theme } from "../theme/theme";
import { DEFAULT_THEME } from "../theme/theme";

interface UseThemeResult {
	/** The currently active theme object. */
	currentTheme: Theme;

	/** A function to apply a new theme. */
	applyNewCurrentTheme: (theme: Theme) => void;

	/** An array of all saved custom themes. */
	customThemes: Theme[];

	/** A function to save a new custom theme. */
	saveCustomTheme: (
		name: string,
		customVariables: Record<string, string>
	) => void;
}

/**
 * A hook for managing the application's theme, including saving and applying custom themes.
 * It stores the current theme and a list of custom themes in local storage.
 *
 * @returns return.theme The currently active theme object.
 * @returns return.applyNewCurrentTheme A function to apply a new theme.
 * @returns return.customThemes An array of saved custom themes.
 * @returns return.saveCustomTheme A function to save a new custom theme.
 */
export function useTheme(): UseThemeResult {
	const [currentTheme, setCurrentTheme] = useLocalStorageAsState<Theme>(
		"theme",
		DEFAULT_THEME
	);
	const [customThemes, setCustomThemes] = useLocalStorageAsState<Theme[]>(
		"customThemes",
		[]
	);

	/**
	 * Applies custom CSS variables to the document's HTML element.
	 *
	 * @param customVariables - An object mapping CSS variable names to their values.
	 */
	const applyCustomVariables = useCallback(
		(customVariables: Record<string, string>) => {
			for (const [key, value] of Object.entries(customVariables)) {
				document.documentElement.style.setProperty(key, value);
			}
		},
		[]
	);

	// Synchronize the theme state with the DOM.
	// This effect runs whenever `currentTheme` changes.
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", currentTheme.name);

		if (currentTheme.customVariables) {
			applyCustomVariables(currentTheme.customVariables);
		} else {
			// If the theme is a default one, remove any inline styles
			// that might have been applied by custom themes.
			document.documentElement.removeAttribute("style");
		}
	}, [currentTheme, applyCustomVariables]);

	/**
	 * Saves a new custom theme to local storage.
	 * @param name The name of the new custom theme.
	 * @param customVariables The CSS variables for the theme.
	 */
	const saveCustomTheme = useCallback(
		(name: string, customVariables: Record<string, string>) => {
			const newTheme: Theme = { name, customVariables };
			setCustomThemes((prevThemes) => [...prevThemes, newTheme]);
		},
		[setCustomThemes]
	);

	/**
	 * Applies a specified theme to the application.
	 * This updates the `currentTheme` state, triggering an update of the DOM.
	 * @param theme The theme object to apply.
	 */
	const applyNewCurrentTheme = useCallback(
		(newCurrentTheme: Theme) => {
			setCurrentTheme(newCurrentTheme);
		},
		[setCurrentTheme]
	);

	return {
		currentTheme,
		applyNewCurrentTheme,
		customThemes,
		saveCustomTheme,
	};
}
