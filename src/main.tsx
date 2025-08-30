import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About.tsx";

// Use BrowserRouter if it's for a regular website
// Use HashRouter if it's for an extension
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<ThemeProvider>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/about" element={<About />} />
				</Routes>
			</ThemeProvider>
		</HashRouter>
	</StrictMode>
);
