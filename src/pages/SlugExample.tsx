import { useParams } from "react-router-dom";
import ChangePage from "../components/ChangePage";
import ThemeButton from "../components/ThemeButton";

function SlugExample() {
	const { id } = useParams<{ id: string }>();

	if (!id) {
		return <div>No id provided</div>;
	}

	return (
		<div className="app-container">
			<h1>This is a Slug example page</h1>
			<p>The current slug id is: {id}</p>

			<ChangePage />
			<ThemeButton />
		</div>
	);
}

export default SlugExample;
