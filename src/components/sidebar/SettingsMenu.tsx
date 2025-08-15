import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export const SettingsMenu = ({
	isCollapsed,
	isLocked,
	setIsLocked,
	darkMode,
	setDarkMode,
	settingsOpen,
	toggleSettings,
}: {
	isCollapsed: boolean;
	isLocked: boolean;
	setIsLocked: (value: boolean) => void;
	darkMode: boolean;
	setDarkMode: (value: boolean) => void;
	settingsOpen: boolean;
	toggleSettings: () => void;
}) => {
	const { animationsEnabled, toggleAnimations } = useSidebar();

	return (
		<div className="w-full">
			{/* Settings Options - Now positioned above the settings button */}
			<div
				className={`w-full transition-all duration-300 ease-in-out mb-2 ${
					settingsOpen
						? "max-h-[180px] opacity-100"
						: "max-h-0 opacity-0 overflow-hidden"
				}`}
			>
				<div className="flex flex-col gap-2 p-2 bg-white border border-gray-200 rounded-md mx-2">
					{/* Switch Travar Barra */}
					<div className="flex items-center justify-between w-full px-2">
						<span className={`text-sm ${isCollapsed ? "hidden" : ""}`}>
							Travar barra
						</span>
						<Switch
							checked={isLocked}
							onCheckedChange={setIsLocked}
							className="ml-auto"
						/>
					</div>

					{/* Switch Tema Escuro */}
					<div className="flex items-center justify-between w-full px-2">
						<span className={`text-sm ${isCollapsed ? "hidden" : ""}`}>
							Tema escuro
						</span>
						<Switch
							checked={darkMode}
							onCheckedChange={val => {
								setDarkMode(val);
								console.log(`Tema: ${val ? "dark" : "light"}`);
							}}
							className="ml-auto"
						/>
					</div>

					{/* Switch Animações */}
					<div className="flex items-center justify-between w-full px-2">
						<span className={`text-sm ${isCollapsed ? "hidden" : ""}`}>
							Animações
						</span>
						<Switch
							checked={animationsEnabled}
							onCheckedChange={toggleAnimations}
							className="ml-auto"
						/>
					</div>
				</div>
			</div>

			{/* Botão configurações */}
			<div className="w-full px-2">
				<Button
					onClick={toggleSettings}
					variant="ghost"
					className={`w-full px-4 py-2.5 flex ${
						isCollapsed ? "justify-start" : "justify-start gap-3"
					} text-gray-500 hover:bg-slate-100 transition-all duration-300`}
				>
					<Settings className="w-5 h-5" />
					<span
						className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
							isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[160px]"
						}`}
					>
						Configurações
					</span>
				</Button>
			</div>
		</div>
	);
};
