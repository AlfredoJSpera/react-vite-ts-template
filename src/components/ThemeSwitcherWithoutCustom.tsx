import { PREDEFINED_THEME_NAMES } from "../theme/theme";
import useThemeWithoutCustom from "../hooks/useThemeWithoutCustom";

function ThemeSwitcherWithoutCustom() {
	const { currentTheme, applyNewCurrentTheme } = useThemeWithoutCustom();

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

export default ThemeSwitcherWithoutCustom;
