// src/pages/layout/DefaultLayout.tsx
import { SideBar } from "@/pages/layout/sideBar";
import { SideBarFloating } from "@/pages/layout/SideBarFloating";
import { Outlet } from "react-router-dom";

export function DefaultLayout() {
	return (
		<div className="flex min-h-screen relative">
			<SideBar />
			<main className="flex-1 relative">
				<SideBarFloating />
				<Outlet />
			</main>
		</div>
	);
}
