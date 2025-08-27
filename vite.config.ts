import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	//! Browser Content Script Only
	build: {
		rollupOptions: {
			input: {
				popup: "index.html",
				content: "src/contentScript.ts",
			},
			output: {
				entryFileNames: (chunk) => {
					if (chunk.name === "content") {
						return "contentScript.js";
					}
					return "[name].js";
				},
			},
		},
	},
	//! ---------------------
});
