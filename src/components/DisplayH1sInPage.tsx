import { useEffect, useState } from "react";
import { sendContentScriptMessage } from "../utils/sendContentScriptMessage";

function DisplayH1sInPage() {
	const [headerText, setHeaderText] = useState<string | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const sendMessage = async () => {
			try {
				const response = await sendContentScriptMessage({
					type: "GET_HEADER",
				});

				if (response.data) {
					setHeaderText(response.data);
				}
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError("An unknown error occurred");
				}
			}
		};

		sendMessage();
	}, []);

	return (
		<div>
			<h3>Test content script</h3>
			<div style={{ marginBottom: "1em" }}>
				{error && (
					<div>
						<p>Error: {error}</p>{" "}
						<i>
							Install the app as an extension and open the popup
							in a page to see it work.
						</i>
					</div>
				)}
				{!error && headerText === null && (
					<p>
						<i>Header not found</i>
					</p>
				)}
				{!error && headerText && <p>Header: {headerText}</p>}
			</div>
		</div>
	);
}

export default DisplayH1sInPage;
