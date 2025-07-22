import { SideBar } from "./home/sideBar";

function	Configuration(props)
{
	return (
		<div className="flex">
			{SideBar()}
			<div><h1>This is Configuration page</h1></div>
		</div>
	);
}

export default	Configuration;
