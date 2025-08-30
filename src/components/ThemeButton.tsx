import { useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

function ThemeButton() {
	// State to control the visibility of the ThemeSwitcher
	const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

	// Function to toggle the visibility
	const toggleThemeSwitcher = () => {
		setShowThemeSwitcher((prev) => !prev);
	};

	return (
		<>
			<button className="toggle-button" onClick={toggleThemeSwitcher}>
				{showThemeSwitcher
					? "Hide Theme Options"
					: "Show Theme Options"}
			</button>
			{showThemeSwitcher && <ThemeSwitcher />}
		</>
	);
}

export default ThemeButton;
