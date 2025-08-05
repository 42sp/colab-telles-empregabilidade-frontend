// src/pages/layout/SideBarFloating.tsx
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavigationButtons } from "@/components/sidebar/NavigationButtons";
import { SettingsMenu } from "@/components/sidebar/SettingsMenu";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { UserProfile } from "@/components/sidebar/UserProfile";
import { useSidebar } from "@/contexts/SidebarContext";

export function SideBarFloating() {
	const { isCollapsed, toggleSidebar, collapseSidebar, expandSidebar } = useSidebar();
	const [isLocked, setIsLocked] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const toggleSettings = () => setSettingsOpen(!settingsOpen);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				if (!isLocked) collapseSidebar();
				setSettingsOpen(false);
			} else {
				if (!isLocked) expandSidebar();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isLocked, collapseSidebar, expandSidebar]);

	return (
		<div
			ref={sidebarRef}
			className={`fixed left-0 top-0 h-full z-30 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out will-change-[width] py-4 px-2 flex flex-col justify-between ${
				isCollapsed ? "w-20" : "w-45 max-w-[235px]"
			}`}
		>
			<div className="flex flex-col justify-between h-full">
				<div className="flex flex-col gap-4 relative">
					<SidebarHeader isCollapsed={isCollapsed} toggleCollapse={toggleSidebar} />

					<div className="absolute top-4 right-2 w-8 h-8">
						{isCollapsed && (
							<Button
								size="icon"
								variant="ghost"
								onClick={toggleSidebar}
								className="w-8 h-8"
							>
								<ChevronRight size={16} />
							</Button>
						)}
					</div>

					<hr className="border-gray-300 border-t-2" />

					<NavigationButtons
						isCollapsed={isCollapsed}
						pathname={location.pathname}
					/>

					<hr className="border-gray-300 border-t-2" />
				</div>

				<div className="flex flex-col gap-2 items-stretch">
					<SettingsMenu
						isCollapsed={isCollapsed}
						isLocked={isLocked}
						setIsLocked={setIsLocked}
						darkMode={darkMode}
						setDarkMode={setDarkMode}
						settingsOpen={settingsOpen}
						toggleSettings={toggleSettings}
					/>
					<hr className="border-gray-300 border-t-2 w-full" />
					<UserProfile
						name="Admin"
						email="admin@edumanager.com"
						isCollapsed={isCollapsed}
					/>
				</div>
			</div>
		</div>
	);
}
