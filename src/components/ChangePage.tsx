import { Link } from "react-router-dom";

function ChangePage() {
	return (
		<div>
			<Link to="/">Home</Link> <Link to="/about">About</Link>{" "}
			<Link to="/slug/abc-def-123">Example slug</Link>
		</div>
	);
}

export default ChangePage;
