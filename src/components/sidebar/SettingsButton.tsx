import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { SettingsMenu } from "./SettingsMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsButtonProps {
  isCollapsed: boolean;
  isLocked: boolean;
  setIsLocked: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const SettingsButton = ({
  isCollapsed,
  isLocked,
  setIsLocked,
  darkMode,
  setDarkMode,
}: SettingsButtonProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="w-full px-2">
          <Tooltip>
            {isCollapsed ? (
              <>
                <TooltipTrigger asChild>
                  {/* Botão configurações */}
                  <Button
                    onClick={toggleMenu}
                    variant="ghost"
                    className="cursor-pointer w-full px-4 py-2.5 flex justify-start text-gray-500 hover:bg-slate-100 transition-all duration-300"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Configurações</p>
                </TooltipContent>
              </>
            ) : (
              // Botão normal quando a barra está expandida
              <Button
                onClick={toggleMenu}
                variant="ghost"
                className="cursor-pointer w-full px-4 py-2.5 flex justify-start gap-3 text-gray-500 hover:bg-slate-100 transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
                <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap inline-block opacity-100 max-w-[160px]">
                  Configurações
                </span>
              </Button>
            )}
          </Tooltip>

          {/* Menu flutuante independente */}
          <SettingsMenu
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isOpen={menuOpen}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
