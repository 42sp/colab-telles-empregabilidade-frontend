import { SideBar } from "./home/sideBar";

function	ScrapData(props)
{
	return (
		<div className="flex">
			{SideBar()}
			<h1>This is Scrap data page</h1>
		</div>
	);
}

export default	ScrapData;
