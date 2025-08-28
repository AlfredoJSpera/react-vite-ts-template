import { useCallback, useEffect, useRef } from "react";
import { Theme, DEFAULT_THEME } from "../theme/theme";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ThemeContextData } from "../theme/ThemeContext";

/** Applies custom CSS variables to the document's HTML element and records keys applied. */
function applyCustomVariables(
	variables: Record<string, string>,
	appliedKeys: Set<string>
) {
	if (typeof document === "undefined") return;

	for (const [key, value] of Object.entries(variables)) {
		document.documentElement.style.setProperty(key, value);
		appliedKeys.add(key);
	}
}

/** Removes only the previously applied CSS variables from the HTML element. */
function removeAppliedCustomVariables(appliedKeys: Set<string>) {
	if (typeof document === "undefined") return;

	for (const key of Array.from(appliedKeys)) {
		document.documentElement.style.removeProperty(key);
		appliedKeys.delete(key);
	}
}

/**
 * A hook for managing the application's theme that stores information in the localStorage.
 *
 * **Supports custom themes**.
 */
function useTheme(): ThemeContextData {
	const [currentTheme, setCurrentTheme] = useLocalStorage<Theme>(
		"theme",
		DEFAULT_THEME
	);

	const [customThemes, setCustomThemes] = useLocalStorage<Theme[]>(
		"customThemes",
		[]
	);

	/** Tracks which custom CSS variables are applied */
	const appliedKeysRef = useRef<Set<string>>(new Set());

	// Synchronize the theme state with the DOM when the theme changes
	useEffect(() => {
		// Prevent DOM manipulation during server-side rendering (SSR)
		if (typeof document === "undefined") return;

		document.documentElement.setAttribute("data-theme", currentTheme.name);

		// Snapshot the Set reference so the cleanup uses the same object
		const appliedKeys = appliedKeysRef.current;

		removeAppliedCustomVariables(appliedKeysRef.current);

		if (currentTheme.customVariables) {
			applyCustomVariables(
				currentTheme.customVariables,
				appliedKeysRef.current
			);
		}

		// Cleanup when the hook unmounts
		return () => {
			removeAppliedCustomVariables(appliedKeys);
		};
	}, [currentTheme]);

	const saveCustomTheme = useCallback(
		(name: string, customVariables: Record<string, string>) => {
			setCustomThemes((prev) => {
				// Prevent duplicate custom theme names
				if (prev.some((theme) => theme.name === name)) {
					console.warn(
						`Custom theme with name "${name}" already exists. Duplicate not saved.`
					);
					return prev;
				}

				const newTheme: Theme = { name, customVariables };
				return [...prev, newTheme];
			});
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
			setCurrentTheme((prev) => {
				if (prev.name === name) {
					return { name, customVariables };
				}
				return prev;
			});
		},
		[setCustomThemes, setCurrentTheme]
	);

	const deleteCustomTheme = useCallback(
		(name: string) => {
			setCustomThemes((prev) =>
				// Create a new array of themes without the selected theme
				prev.filter((theme) => theme.name !== name)
			);

			// If deleting the current theme, fall back to DEFAULT_THEME
			setCurrentTheme((prev) => {
				if (prev.name === name) {
					return DEFAULT_THEME;
				}
				return prev;
			});
		},
		[setCustomThemes, setCurrentTheme]
	);

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
		editCustomTheme,
		deleteCustomTheme,
	};
}

export default useTheme;
