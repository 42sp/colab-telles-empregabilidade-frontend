import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const SidebarHeader = ({
	isCollapsed,
	toggleCollapse,
}: {
	isCollapsed: boolean;
	toggleCollapse: () => void;
}) => {
	return (
		<div className="px-4 mb-2 flex justify-between items-center min-h-[40px]">
			<h1
				className={`font-bold text-xl transition-all duration-300 ease-in-out transform ${
					isCollapsed ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
				}`}
			>
				Manager
			</h1>

			{/* Botão sempre presente no DOM, apenas escondido visualmente */}
			<Button
				size="icon"
				variant="ghost"
				onClick={toggleCollapse}
				aria-label={isCollapsed ? "Expandir barra" : "Colapsar barra"}
				className={`cursor-pointer transition-transform duration-300 ease-in-out z-30 ${
					isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
				}`}
			>
				<ChevronLeft size={16} />
			</Button>
		</div>
	);
};
