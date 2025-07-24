import { SideBar } from "../layout/sideBar";
import { StudentsList } from "./studentsList";

function Home()
{
	return (
		<div className="flex">
			{/* <h1>welcome to the Home Page</h1>
			<p>This is the home page of our application.</p>
			<Link to="/login" className="text-blue-500 hover:underline">
				Go to Login
			</Link> */}
			{StudentsList()}
		</div>
	);
};

export default Home;
