import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { PREDEFINED_THEME_NAMES } from "./theme";

export default function ThemeSwitcher() {
	const {
		currentTheme,
		applyNewCurrentTheme,
		customThemes,
		saveCustomTheme,
	} = useTheme();

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
			"--color-border": text + "4d", // A translucent version
			"--color-button-bg": text,
			"--color-button-bg-hover": text + "cc",
			"--color-button-text": bg,
			"--color-button-border": text,
			"--color-input-bg": bg,
		});
		setNewThemeName("");
	};

	return (
		<div className="theme-container">
			<h2>Current Theme: {currentTheme.name}</h2>

			<div>
				<h3>Default themes</h3>
				<div className="button-group">
					{PREDEFINED_THEME_NAMES.map((t) => (
						<button
							key={t}
							onClick={() => applyNewCurrentTheme({ name: t })}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			<div>
				<h3>Custom themes</h3>
				<div className="button-group">
					{customThemes.map((t) => (
						<button
							key={t.name}
							onClick={() => applyNewCurrentTheme(t)}
						>
							{t.name}
						</button>
					))}
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
