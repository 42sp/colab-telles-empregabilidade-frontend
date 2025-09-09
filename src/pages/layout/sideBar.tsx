// src/pages/layout/SideBar.tsx
import { useSidebar } from "@/contexts/SidebarContext";

export function SideBar() {
	const { isCollapsed } = useSidebar();

	// Estrutura base visível no fluxo da página
	return (
		<div
			aria-hidden
			className={`transition-all duration-300 ease-in-out will-change-[width] border-r border-gray-200 bg-gray-100 ${
				isCollapsed ? "w-20" : "w-45 max-w-[235px]"
			}`}
		></div>
	);
}
