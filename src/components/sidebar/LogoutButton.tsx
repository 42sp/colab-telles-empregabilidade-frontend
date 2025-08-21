import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

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
        <div className="w-full px-2">
            <Button
                variant={"ghost"}
                onClick={handleLogout}
                className={`w-full px-6 py-2.5 flex ${
                            isCollapsed ? "justify-start" : "justify-start gap-3"
                        } text-gray-500 hover:bg-slate-100 transition-all duration-300`}
            >
                <LogOut className="w-5 h-5 min-w-[20px]" />
                <span
						className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
							isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[160px]"
						}`}
				>
                    Logout
                </span>
            </Button>
        </div>
	);
};
