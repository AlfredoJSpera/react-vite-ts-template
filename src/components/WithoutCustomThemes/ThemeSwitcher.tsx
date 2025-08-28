import { useThemeContext } from "../../hooks/WithoutCustomThemes/useThemeContext";
import { PREDEFINED_THEME_NAMES } from "../../theme/themeConfigs";

function ThemeSwitcher() {
	const { currentTheme, applyNewCurrentTheme } = useThemeContext();

	return (
		<div className="theme-container">
			<h2>Current Theme: {currentTheme.name}</h2>

			<div>
				<h3>Default themes</h3>
				<div className="button-group">
					{PREDEFINED_THEME_NAMES.map((themeName) => {
						return (
							<button
								key={themeName}
								onClick={() =>
									applyNewCurrentTheme({ name: themeName })
								}
							>
								{themeName}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default ThemeSwitcher;
