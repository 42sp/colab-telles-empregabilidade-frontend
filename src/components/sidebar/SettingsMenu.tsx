import { Switch } from "@/components/ui/switch";
import { useSidebar } from "@/contexts/SidebarContext";
import type { FC } from "react";

interface SettingsMenuProps {
  isLocked: boolean;
  setIsLocked: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const SettingsMenu: FC<SettingsMenuProps> = ({
  isLocked,
  setIsLocked,
  darkMode,
  setDarkMode,
}) => {
  const { animationsEnabled, toggleAnimations } = useSidebar();

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Travar barra */}
      <div className="flex items-center justify-between">
        <span className="text-sm">Travar barra</span>
        <Switch
          checked={isLocked}
          onCheckedChange={setIsLocked}
          className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-400"
        />
      </div>

      {/* Tema escuro */}
      {/* <div className="flex items-center justify-between">
        <span className="text-sm">Tema escuro</span>
        <Switch
          checked={darkMode}
          onCheckedChange={setDarkMode}
          className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-400"
        />
      </div> */}

      {/* Animações */}
      <div className="flex items-center justify-between">
        <span className="text-sm">Animações</span>
        <Switch
          checked={animationsEnabled}
          onCheckedChange={toggleAnimations}
          className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-400"
        />
      </div>
    </div>
  );
};
