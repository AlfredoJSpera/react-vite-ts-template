import { useState } from "react";
import { PREDEFINED_THEME_NAMES } from "../theme/theme";
import { useThemeContext } from "../hooks/useThemeContext";

function ThemeSwitcher() {
	const {
		currentTheme,
		applyNewCurrentTheme,
		customThemes,
		saveCustomTheme,
		editCustomTheme,
		deleteCustomTheme,
	} = useThemeContext();

	// States for the new/edit theme form
	const [newThemeName, setNewThemeName] = useState("");
	const [bg, setBg] = useState("#ffffff");
	const [text, setText] = useState("#000000");

	const handleCreateTheme = () => {
		if (!newThemeName.trim()) {
			alert("Please enter a theme name.");
			return;
		}

		saveCustomTheme(newThemeName, {
			"--color-bg": bg,
			"--color-text": text,
			"--color-heading": text,
			"--color-card-bg": bg,
			"--color-border": text + "4d",
			"--color-button-bg": text,
			"--color-button-bg-hover": text + "cc",
			"--color-button-text": bg,
			"--color-button-border": text,
			"--color-input-bg": bg,
		});

		setNewThemeName("");
	};

	const handleEditTheme = (themeName: string) => {
		editCustomTheme(themeName, {
			"--color-bg": bg,
			"--color-text": text,
			"--color-heading": text,
			"--color-card-bg": bg,
			"--color-border": text + "4d",
			"--color-button-bg": text,
			"--color-button-bg-hover": text + "cc",
			"--color-button-text": bg,
			"--color-button-border": text,
			"--color-input-bg": bg,
		});
	};

	const handleDeleteTheme = (themeName: string) => {
		if (confirm(`Are you sure you want to delete theme "${themeName}"?`)) {
			deleteCustomTheme(themeName);
		}
	};

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

			<div>
				<h3>Custom themes</h3>
				<div className="button-group">
					{customThemes.map((theme) => {
						return (
							<div key={theme.name} className="custom-theme-item">
								<button
									onClick={() => applyNewCurrentTheme(theme)}
								>
									{theme.name}
								</button>
								<button
									onClick={() => handleEditTheme(theme.name)}
									title={"Edit " + theme.name}
								>
									E
								</button>
								<button
									onClick={() =>
										handleDeleteTheme(theme.name)
									}
									title={"Delete " + theme.name}
								>
									D
								</button>
							</div>
						);
					})}
				</div>
			</div>

			<div>
				<h3>Create a new custom theme</h3>
				<div className="form-group">
					<input
						type="text"
						placeholder="Theme name"
						value={newThemeName}
						onChange={(e) => setNewThemeName(e.target.value)}
					/>
					<label>
						Background color:
						<input
							type="color"
							value={bg}
							onChange={(e) => setBg(e.target.value)}
						/>
					</label>
					<label>
						Text color:
						<input
							type="color"
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
					</label>
					<button onClick={handleCreateTheme}>Create theme</button>
				</div>
			</div>
		</div>
	);
}

export default ThemeSwitcher;
