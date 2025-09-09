import { Button } from "@/components/ui/button";
import { Home as HomeIcon, LayoutDashboard, Database, Import, BotMessageSquare } from "lucide-react";
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
    { to: "/chat", label: "Chat", icon: BotMessageSquare }
  ];

  return (
    <div className="flex flex-col w-auto gap-1 mx-2 relative">
      {links.map(({ to, label, icon: Icon }) => {
        const isActive = pathname === to;

        return (
          <Link key={to} to={to} className="w-full relative">
            <Button
              variant="ghost"
              className={`w-full px-4 py-2.5 flex items-center justify-start gap-3
               text-gray-500 hover:bg-slate-100 relative`}
            >
              <Icon className="size-4.5 flex-none text-gray-500 " />

              <motion.span
                className="overflow-hidden whitespace-nowrap inline-block"
                initial={{ opacity: isCollapsed ? 0 : 1, maxWidth: isCollapsed ? 0 : 160 }}
                animate={{ opacity: isCollapsed ? 0 : 1, maxWidth: isCollapsed ? 0 : 160 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {label}
              </motion.span>

              {/* Motion highlight da barra ativa */}
              <AnimatePresence>
                {isActive && !isCollapsed && (
                  <motion.div
                    key={to}
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
