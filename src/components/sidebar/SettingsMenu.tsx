import { Switch } from "@/components/ui/switch";
import { useSidebar } from "@/contexts/SidebarContext";
import type { FC } from "react";

interface SettingsMenuProps {
  isLocked: boolean;
  setIsLocked: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isOpen: boolean;
}

export const SettingsMenu: FC<SettingsMenuProps> = ({
  isLocked,
  setIsLocked,
  darkMode,
  setDarkMode,
  isOpen,
}) => {
  const { animationsEnabled, toggleAnimations } = useSidebar();

  return (
    <div
      className={`absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-300 overflow-hidden ${
        isOpen ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex flex-col gap-2 p-4">
        {/* Travar barra */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Travar barra</span>
          <Switch checked={isLocked} onCheckedChange={setIsLocked} />
        </div>

        {/* Tema escuro */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Tema escuro</span>
          <Switch
            checked={darkMode}
            onCheckedChange={(val) => setDarkMode(val)}
          />
        </div>

        {/* Animações */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Animações</span>
          <Switch checked={animationsEnabled} onCheckedChange={toggleAnimations} />
        </div>
      </div>
    </div>
  );
};
