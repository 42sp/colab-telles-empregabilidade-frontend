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
		<div className="px-4 mb-2 flex justify-between items-center">
			<h1
				className={`font-bold text-xl transition-all duration-300 ease-in-out transform ${
					isCollapsed ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
				}`}
			>
				Manager
			</h1>

			{!isCollapsed && (
				<Button
					size="icon"
					variant="ghost"
					onClick={toggleCollapse}
					className="transition-transform duration-300 ease-in-out"
				>
					<ChevronLeft size={16} />
				</Button>
			)}
		</div>
	);
};
