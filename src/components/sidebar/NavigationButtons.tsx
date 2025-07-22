import { Button } from "@/components/ui/button";
import {
	Home as HomeIcon,
	LayoutDashboard,
	Database,
	Import,
} from "lucide-react";
import { Link } from "react-router-dom";

export const NavigationButtons = ({
	isCollapsed,
	pathname,
}: {
	isCollapsed: boolean;
	pathname: string;
}) => {
	const links = [
		{ to: "/home", label: "Home", icon: HomeIcon },
		{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ to: "/scrap-data", label: "Scrap Data", icon: Database },
		{ to: "/import", label: "Importação", icon: Import },
	];

	return (
		<div className="flex flex-col w-auto gap-1 mx-2">
			{links.map(({ to, label, icon: Icon }) => {
				const isActive = pathname === to;
				const activeStyle = isActive
					? "bg-slate-200 text-black font-medium border-l-[5px] border-black"
					: "text-gray-500 hover:bg-slate-100";

				return (
					<Link key={to} to={to} className="w-full">
						<Button
							variant="ghost"
							className={`w-full px-4 py-2.5 flex ${
								isCollapsed ? "justify-center" : "justify-start gap-3"
							} ${activeStyle} transition-property-[background-color,transform] transition-duration-150`}
						>
							<Icon className="w-5 h-5 min-w-[20px]" />
							<span
								className={`overflow-hidden whitespace-nowrap inline-block transform transition-[opacity,max-width] duration-150 ease-out ${
									isCollapsed
										? "opacity-0 max-w-0"
										: "opacity-100 max-w-[160px]"
								}`}
							>
								{label}
							</span>
						</Button>
					</Link>
				);
			})}
		</div>
	);
};
