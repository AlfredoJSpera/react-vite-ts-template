interface props {
	showThemeSwitcher: boolean;
	toggleThemeSwitcher: () => void;
}

function ThemeButton({ showThemeSwitcher, toggleThemeSwitcher }: props) {
	return (
		<button className="toggle-button" onClick={toggleThemeSwitcher}>
			{showThemeSwitcher ? "Hide Theme Options" : "Show Theme Options"}
		</button>
	);
}

export default ThemeButton;
