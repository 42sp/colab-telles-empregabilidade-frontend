import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Home as HomeIcon,
	LayoutDashboard,
	Database,
	Settings,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function header(title: string, isCollapsed: boolean) {
	return (
		<div className="px-4 mb-2">
			<h1
				className={`font-bold text-xl transition-opacity transition-transform duration-300 ease-in-out transform ${
					isCollapsed ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
				}`}
			>
				{title}
			</h1>
		</div>
	);
}

function buttons(isCollapsed: boolean) {
	const location = useLocation();
	const links = [
		{ to: "/home", label: "Home", icon: HomeIcon },
		{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ to: "/scrap-data", label: "Scrap Data", icon: Database },
		{ to: "/configuration", label: "Configuração", icon: Settings },
	];

	return (
		<div className="flex flex-col w-auto gap-1 mx-2">
			{links.map(({ to, label, icon: Icon }) => {
				const isActive = location.pathname === to;
				const activeStyle = isActive
					? "bg-slate-200 text-black font-medium border-l-[5px] border-black"
					: "text-gray-500 hover:bg-slate-100";

				return (
					<Link key={to} to={to} className="w-full">
						<Button
							variant="ghost"
							className={`w-full justify-start gap-3 px-4 py-2.5 ${activeStyle}`}
						>
							<Icon className="w-5 h-5 min-w-[20px]" />
							<span
								className={`transition-opacity transition-max-width duration-300 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
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
}

function showUser(name: string, email: string, isCollapsed: boolean) {
	return (
		<div className="flex items-center px-4">
			<div className="w-8 h-8 min-w-[2rem] rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-gray-700">
				{name[0].toUpperCase()}
			</div>
			<div
				className={`ml-3 overflow-hidden whitespace-nowrap transition-opacity transition-max-width duration-300 ease-in-out ${
					isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[180px]"
				}`}
			>
				<div className="flex flex-col">
					<span className="text-sm font-medium">{name}</span>
					<span className="text-xs text-gray-500">{email}</span>
				</div>
			</div>
		</div>
	);
}

export function SideBar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	let userName: string = "Admin";
	let userEmail: string = "admin@admin.com";

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setIsCollapsed(true);
			} else {
				setIsCollapsed(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			ref={sidebarRef}
			className={`${
				isCollapsed ? "w-20" : "w-64"
			} bg-white text-black py-4 flex flex-col border-r border-gray-200 min-h-screen gap-4 transition-width duration-300 ease-in-out max-w-[235px]`}
		>
			{header("Manager", isCollapsed)}
			<hr className="border-gray-300 border-t-2" />
			{buttons(isCollapsed)}
			<hr className="border-gray-300 border-t-2" />
			<div>{showUser(userName, "admin@edumanager.com", isCollapsed)}</div>
		</div>
	);
}
