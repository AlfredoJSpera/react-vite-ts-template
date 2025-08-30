import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div style={{ padding: 20 }}>
			<h1>404 - Page not found</h1>
			<p>The page you're looking for doesn't exist.</p>
			<p>
				<Link to="/">Return to home</Link>
			</p>
		</div>
	);
}
