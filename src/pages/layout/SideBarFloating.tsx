import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavigationButtons } from "@/components/sidebar/NavigationButtons";
import { SettingsButton } from "@/components/sidebar/SettingsButton";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "@/components/sidebar/LogoutButton";
import { UserProfile } from "@/components/sidebar/UserProfile";


export function SideBarFloating() {
	const { isCollapsed, toggleSidebar, collapseSidebar, expandSidebar } = useSidebar();
	const [isLocked, setIsLocked] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const { user } = useAuth();

	const toggleSettings = () => setSettingsOpen(!settingsOpen);

  // util: verifica se um elemento é um botão/link/input (interativo)
  const isInteractiveElement = (el: Element | null) => {
    if (!el) return false;
    return !!el.closest(
      "button, [role='button'], a, input, select, textarea, label, [data-sidebar-ignore]"
    );
  };

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!sidebarRef.current || !target) return;

      const clickedInside = sidebarRef.current.contains(target);

      if (clickedInside) {
        if (isInteractiveElement(target)) {
          // clique em botão/link/input → não expande nem colapsa
          return;
        } else {
          // clique dentro da sidebar mas fora de botões → expande (se não estiver locked)
          if (!isLocked) expandSidebar();
        }
      } else {
        // clique fora da sidebar → colapsa (se não estiver locked)
        if (!isLocked) collapseSidebar();
        setSettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
								className="w-8 h-8 cursor-pointer "
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
					<SettingsButton
						isCollapsed={isCollapsed}
						isLocked={isLocked}
						setIsLocked={setIsLocked}
						darkMode={darkMode}
						setDarkMode={setDarkMode}
					/>
					<LogoutButton isCollapsed={isCollapsed} />
					<hr className="border-gray-300 border-t-2 w-full" />
					<UserProfile
						name={user?.name || "Usuário"}
						email={user?.email || "user@emai.com"}
						isCollapsed={isCollapsed}
					/>
				</div>
			</div>
		</div>
	);
}
