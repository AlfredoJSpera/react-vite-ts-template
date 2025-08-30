import { Link } from "react-router-dom";

function ChangePage() {
	return (
		<div>
			<Link to="/">Home</Link> <Link to="/about">About</Link>
		</div>
	);
}

export default ChangePage;
