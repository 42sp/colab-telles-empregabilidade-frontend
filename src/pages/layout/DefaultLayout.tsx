import { SideBar } from "@/pages/layout/sideBar";
import { Outlet } from "react-router-dom";

export function DefaultLayout() {
	return (
		<div className="flex">
			<SideBar />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
