import { useContentScriptMessage } from "../hooks/useContentScriptMessage";

function DisplayH1sInPage() {
	const { data, loading, error } = useContentScriptMessage(
		{ type: "GET_HEADER" },
		{ data: "No header found" }
	);

	if (loading) {
		return <div>Searching for the header...</div>;
	}

	if (error) {
		return (
			<>
				<div>Error while searching for the header: {error}</div>
				<i>
					Install the app as an extension and open the popup in a page
					to see it work.
				</i>
			</>
		);
	}

	if (typeof data.data === "string") {
		return (
			<div>
				Header found: <code>{data.data}</code>
			</div>
		);
	} else if (data.data === null) {
		return <div>No header found</div>;
	} else {
		return <div>Unknown "GET_HEADER" response type</div>;
	}
}

export default DisplayH1sInPage;
