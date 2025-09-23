import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LogoutButtonProps {
  isCollapsed: boolean;
}

export const LogoutButton = ({ isCollapsed }: LogoutButtonProps) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };

  return (
    <TooltipProvider>
      <div className="w-full px-2">
        <Tooltip>
          {isCollapsed ? (
            <>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="cursor-pointer w-full px-6 py-2.5 flex justify-start text-gray-500 hover:bg-slate-100 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5 min-w-[20px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="cursor-pointer w-full px-6 py-2.5 flex justify-start gap-3 text-gray-500 hover:bg-slate-100 transition-all duration-300"
            >
              <LogOut className="w-5 h-5 min-w-[20px]" />
              <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap inline-block opacity-100 max-w-[160px]">
                Logout
              </span>
            </Button>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
