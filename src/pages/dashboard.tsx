import { SideBar } from "./home/sideBar";

function	Dashboard(props)
{
	return (
		<div className="flex">
			{SideBar()}
			<h1>This is dashboard page</h1>
		</div>
	);
}

export default	Dashboard;
