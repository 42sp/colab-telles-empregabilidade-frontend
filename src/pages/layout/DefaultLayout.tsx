import { SideBar } from "@/pages/layout/sideBar";
import { Outlet } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";

export function DefaultLayout() {
	const { isCollapsed } = useSidebar();

	return (
		<div className="flex">
			{/* Reserva o espaço da sidebar para evitar que o conteúdo "pule" */}
			<div
				className={`${isCollapsed ? "w-20" : "w-45"} transition-all duration-300`}
			/>
			{/* Sidebar fixa na tela */}
			<SideBar />
			{/* Conteúdo principal, ocupa o restante */}
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
