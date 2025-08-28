export type ContentScriptMessageType = "GET_HEADER" | "OTHER";

export interface ContentScriptMessage {
	type: ContentScriptMessageType;
	payload?: unknown;
}

export interface ContentScriptResponse {
	data?: string | null; // Insert your type here if you plan to return a complex object
	error?: string;
}
