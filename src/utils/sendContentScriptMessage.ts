import {
	ContentScriptMessage,
	ContentScriptResponse,
} from "../types/ContentScript";

/**
 * Sends a message to the active content script and returns the response.
 *
 * @param message The message to send.
 * @returns A promise that resolves with the response from the content script.
 * @throws {Error} If no active tab is found or an error occurs during messaging.
 */
export async function sendContentScriptMessage(
	message: ContentScriptMessage
): Promise<ContentScriptResponse> {
	const tabs = await browser.tabs.query({
		active: true,
		currentWindow: true,
	});

	if (tabs.length === 0 || !tabs[0].id) {
		throw new Error("No active tab found.");
	}

	const response: ContentScriptResponse = await browser.tabs.sendMessage(
		tabs[0].id,
		message
	);

	if (response?.error) {
		throw new Error(response.error);
	}

	return response;
}
