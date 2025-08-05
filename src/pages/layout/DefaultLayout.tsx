// src/pages/layout/DefaultLayout.tsx
import { SideBar } from "./sideBar";
import { SideBarFloating } from "./SideBarFloating";
import { Outlet } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";

export function DefaultLayout() {
  const { isCollapsed } = useSidebar();

  // valores em px que batem com suas classes:
  const collapsedWidth = 80;   // w-20 -> 5rem -> 80px
  const expandedWidth = 235;   // max-w-[235px]

  return (
    <div className="min-h-screen relative">
      <SideBar /> {/* mantém a versão no fluxo se precisar */}
      <SideBarFloating />

      {/* main agora tem margin-left dinâmica para "respeitar" o fixed */}
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: `${isCollapsed ? collapsedWidth : expandedWidth}px`,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
