export type ContentScriptMessageType = "GET_HEADER" | "OTHER";

export interface ContentScriptMessage {
	type: ContentScriptMessageType;
	payload?: unknown;
}

export interface ContentScriptResponse {
	data?: unknown;
	error?: string;
}
