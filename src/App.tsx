import { useState } from "react";
import "./css/App.css";
import ThemeSwitcher from "./components/ThemeSwitcher";
import ThemeButton from "./components/ThemeButton";
import DisplayH1InPage from "./components/DisplayH1InPage";

export default function App() {
	// State to control the visibility of the ThemeSwitcher
	const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

	// Function to toggle the visibility
	const toggleThemeSwitcher = () => {
		setShowThemeSwitcher((prev) => !prev);
	};

	return (
		<div className="app-container">
			<h1>React + Vite + TypeScript</h1>
			<DisplayH1InPage />
			<ThemeButton
				showThemeSwitcher={showThemeSwitcher}
				toggleThemeSwitcher={toggleThemeSwitcher}
			/>
			{showThemeSwitcher && <ThemeSwitcher />}
		</div>
	);
}
