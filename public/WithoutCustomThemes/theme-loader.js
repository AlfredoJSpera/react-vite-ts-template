//? This file is in /public so that Vite serves it in both dev and build without duplication

// Immediately apply the saved theme from localStorage
(function () {
	try {
		const theme = localStorage.getItem("theme");

		if (theme) {
			const parsed = JSON.parse(theme);

			if (parsed?.name) {
				document.documentElement.setAttribute(
					"data-theme",
					parsed.name
				);
			}
		}
	} catch (e) {
		console.warn("Failed to load theme before React:", e);
	}
})();
