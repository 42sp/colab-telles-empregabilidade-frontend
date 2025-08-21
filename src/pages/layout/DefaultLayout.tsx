import { SideBar } from "@/pages/layout/sideBar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export function DefaultLayout() {
	return (
		<div className="flex">
			<ToastContainer position="top-center" hideProgressBar={true} />
			<SideBar />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
