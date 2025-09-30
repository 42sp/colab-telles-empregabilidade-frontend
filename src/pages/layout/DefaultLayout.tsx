// src/pages/layout/DefaultLayout.tsx
import { SideBar } from "@/pages/layout/sideBar";
import { SideBarFloating } from "@/pages/layout/SideBarFloating";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export function DefaultLayout() {
	return (
		<div className="flex min-h-screen relative" style={{ overflowX: "hidden" }}>
			<ToastContainer position="top-center" hideProgressBar={true} />
			<SideBar />
			<main className="flex-1 relative overflow-hidden">
				<SideBarFloating />
				<div className="h-full overflow-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
