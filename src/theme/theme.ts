export interface Theme {
	/**
	 * The name of the theme.
	 * @example "dark", "blue", "custom-1", ...
	 */
	name: string;
	/**
	 * A set of CSS variables and their values for custom themes.
	 *
	 * **It must be `undefined` for built-in themes.**
	 */
	customVariables?: Record<string, string>;
}

export const PREDEFINED_THEME_NAMES = ["light", "dark", "blue"];
export const DEFAULT_THEME: Theme = { name: "light" };
