import { ReactNode } from "react";
import useTheme from "../../hooks/WithoutCustomThemes/useTheme";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
	const { currentTheme, applyNewCurrentTheme } = useTheme();

	return (
		<ThemeContext.Provider
			value={{
				currentTheme,
				applyNewCurrentTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}
