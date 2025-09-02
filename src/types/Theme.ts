export interface Theme {
	/** The name of the theme. */
	name: string;
	/** A set of CSS variables and their values for custom themes. It must be `undefined` for predefined themes. */
	customVariables?: Record<string, string>;
}
