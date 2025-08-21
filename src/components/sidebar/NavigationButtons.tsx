import { Button } from "@/components/ui/button";
import { Home as HomeIcon, LayoutDashboard, Database, Import } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="flex flex-col w-auto gap-1 mx-2 relative">
      {links.map(({ to, label, icon: Icon }) => {
        const isActive = pathname === to;

        return (
          <Link key={to} to={to} className="w-full relative">
            <Button
              variant="ghost"
              className={`w-full px-4 py-2.5 flex ${
                isCollapsed ? "justify-center" : "justify-start gap-3"
              } text-gray-500 hover:bg-slate-100 relative`}
            >
              <Icon className="w-5 h-5 min-w-[20px]" />
              <span
                className={`overflow-hidden whitespace-nowrap inline-block transform transition-[opacity,max-width] duration-150 ease-out ${
                  isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[160px]"
                }`}
              >
                {label}
              </span>

              {/* Motion highlight com fade in/out suave */}
              <AnimatePresence>
                {isActive && !isCollapsed && (
                  <motion.div
                    key={to} // importante para animar corretamente a troca
                    className="absolute left-0 top-0 h-full w-1 bg-black rounded-tr-md rounded-br-md"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
