import ChangePage from "../components/ChangePage";
import ThemeButton from "../components/ThemeButton";
import { useLocation } from "react-router-dom";

function About() {
	const location = useLocation();

	return (
		<div className="app-container">
			<h1>This is an About page</h1>

			<p>Route pathname: {location.pathname}</p>

			<ChangePage />
			<ThemeButton />
		</div>
	);
}

export default About;
