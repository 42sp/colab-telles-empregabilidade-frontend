import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="home-container flex items-center justify-center flex-col space-y-3 h-[100vh]">
			<h1>Welcome to the Home Page</h1>
			<p>This is the home page of our application.</p>
			<Link to="/login" className="text-blue-500 hover:underline">
				Go to Login
			</Link>
		</div>
	);
};

export default Home;
