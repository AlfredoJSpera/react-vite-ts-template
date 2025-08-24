// src/components/ThemeSwitcher.tsx
import React, { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { PREDEFINED_THEME_NAMES } from "./theme";

export default function ThemeSwitcher() {
	const {
		currentTheme,
		applyNewCurrentTheme,
		customThemes,
		saveCustomTheme,
	} = useTheme();

	// States for the new theme form
	const [newThemeName, setNewThemeName] = useState("");
	const [bg, setBg] = useState("#ffffff");
	const [text, setText] = useState("#000000");

	return (
		<div>
			<h2>Current Theme: {currentTheme.name}</h2>

			<h3>Default themes</h3>
			{PREDEFINED_THEME_NAMES.map((t) => (
				<button
					key={t}
					onClick={() => applyNewCurrentTheme({ name: t })}
				>
					{t}
				</button>
			))}

			<h3>Custom themes</h3>
			{customThemes.map((t) => (
				<button key={t.name} onClick={() => applyNewCurrentTheme(t)}>
					{t.name}
				</button>
			))}

			<h3>Create a new custom theme</h3>
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
			<button
				onClick={() =>
					saveCustomTheme(newThemeName, {
						"--color-bg": bg,
						"--color-text": text,
					})
				}
			>
				Create theme
			</button>
		</div>
	);
}
