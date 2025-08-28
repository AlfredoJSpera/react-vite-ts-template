import { ReactNode } from "react";
import useTheme from "../hooks/useTheme";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
	const {
		currentTheme,
		applyNewCurrentTheme,
		customThemes,
		saveCustomTheme,
		editCustomTheme,
		deleteCustomTheme,
	} = useTheme();

	return (
		<ThemeContext.Provider
			value={{
				currentTheme,
				applyNewCurrentTheme,
				customThemes,
				saveCustomTheme,
				editCustomTheme,
				deleteCustomTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}
