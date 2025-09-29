import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion"

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
			<motion.div
				initial={{ opacity: 0, x: 10 }}
				animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? 10 : 0 }}
				transition={{ duration: 0.3, delay: isCollapsed ? 0 : 0.3 }}
			>
				<Button
					size="icon"
					variant="ghost"
					onClick={toggleCollapse}
					aria-label={isCollapsed ? "Expandir barra" : "Colapsar barra"}
					className=" cursor-pointer z-100"
				>
					<ChevronLeft size={16} />
				</Button>
			</motion.div>
		</div>
	);
};
