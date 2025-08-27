import {
	ContentScriptMessage,
	ContentScriptResponse,
} from "./types/contentScriptTypes";

console.log("Content script injected!");

function getHeaderText(): string | null {
	const header = document.querySelector<HTMLHeadingElement>("h1");
	return header ? header.innerText : null;
}

browser.runtime.onMessage.addListener(
	(
		msg: ContentScriptMessage,
		_sender,
		sendResponse: (response?: ContentScriptResponse) => void
	) => {
		if (msg.type === "GET_HEADER") {
			const text = getHeaderText();
			// Set an error here to use the `error` from `useContentScriptMessage`
			sendResponse({ data: text });
		}
		return true;
	}
);
