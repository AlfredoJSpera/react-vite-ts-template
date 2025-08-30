import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";

// Use Browser Router if it's for a regular website
// Use Hash Router if it's for an extension
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<ThemeProvider>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/about" element={<About />} />
					{/* Catch-all route for not found pages */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</ThemeProvider>
		</HashRouter>
	</StrictMode>
);
