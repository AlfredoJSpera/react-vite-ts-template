import "./css/App.css";
import ThemeButton from "./components/ThemeButton";
import DisplayH1InPage from "./components/DisplayH1InPage";
import ChangePage from "./components/ChangePage";

function App() {
	return (
		<div className="app-container">
			<h1>React + Vite + TypeScript</h1>
			<ChangePage />
			<DisplayH1InPage />
			<ThemeButton />
		</div>
	);
}

export default App;
