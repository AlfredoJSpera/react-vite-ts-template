import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";
import { HashRouter } from "react-router-dom";

// Use BrowserRouter if it's for a regular website
// Use HashRouter if it's for an extension
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</HashRouter>
	</StrictMode>
);
