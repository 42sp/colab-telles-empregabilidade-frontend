// src/contexts/SidebarContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type SidebarContextType = {
	isCollapsed: boolean;
	toggleSidebar: () => void;
	collapseSidebar: () => void;
	expandSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleSidebar = () => setIsCollapsed(prev => !prev);
	const collapseSidebar = () => setIsCollapsed(true);
	const expandSidebar = () => setIsCollapsed(false);

	return (
		<SidebarContext.Provider
			value={{ isCollapsed, toggleSidebar, collapseSidebar, expandSidebar }}
		>
			{children}
		</SidebarContext.Provider>
	);
}
/* eslint-disable react-refresh/only-export-components */
export function useSidebar() {
	const context = useContext(SidebarContext);
	if (!context)
		throw new Error("useSidebar must be used within a SidebarProvider");
	return context;
}
