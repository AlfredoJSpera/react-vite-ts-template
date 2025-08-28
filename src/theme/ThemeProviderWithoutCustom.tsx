import { ReactNode } from "react";
import useThemeWithoutCustom from "../hooks/useThemeWithoutCustom";
import { ThemeContextWithoutCustom } from "./ThemeContextWithoutCustom";

export function ThemeProviderWithoutCustom({
	children,
}: {
	children: ReactNode;
}) {
	const { currentTheme, applyNewCurrentTheme } = useThemeWithoutCustom();

	return (
		<ThemeContextWithoutCustom.Provider
			value={{
				currentTheme,
				applyNewCurrentTheme,
			}}
		>
			{children}
		</ThemeContextWithoutCustom.Provider>
	);
}
