import { useState, useEffect } from "react";
import {
	ContentScriptMessage,
	ContentScriptResponse,
} from "../types/contentScriptTypes";

/**
 * A hook for sending and receiving messages from the contentScript on the page.
 *
 * @param message The message to send
 * @param initialValue The initial value of the response from the content script
 * @returns The response, if the content script is loading the response and an error
 */
export function useContentScriptMessage(
	message: ContentScriptMessage,
	initialValue: ContentScriptResponse
) {
	const [data, setData] = useState<ContentScriptResponse>(initialValue);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function sendMessage() {
			try {
				setLoading(true);
				setError(null);

				const tabs = await browser.tabs.query({
					active: true,
					currentWindow: true,
				});
				if (tabs.length === 0 || !tabs[0].id) {
					throw new Error("No active tab found.");
				}

				const response: ContentScriptResponse =
					await browser.tabs.sendMessage(tabs[0].id, message);
				if (response?.error) {
					setError(response.error);
				} else {
					setData(response);
				}
			} catch (caughtError) {
				if (caughtError instanceof Error) {
					setError(caughtError.message);
				} else {
					setError("An unknown error occurred.");
				}
			} finally {
				setLoading(false);
			}
		}

		sendMessage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message.type]);

	return { data, loading, error };
}
