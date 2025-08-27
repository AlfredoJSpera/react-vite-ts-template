export type ContentScriptMessageType = "GET_HEADER" | "OTHER";

export interface ContentScriptMessage {
	type: ContentScriptMessageType;
	payload?: unknown;
}

export interface ContentScriptResponse {
	data?: unknown; // Insert your type instead of unknown if you plan to return a complex object
	error?: string;
}
