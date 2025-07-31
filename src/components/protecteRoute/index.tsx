import type { ReactNode } from "react";
import { Navigate } from "react-router";
import "./style.css";

const ProtecteRoute = ({ children }: { children: ReactNode }) => {
	const accessToken = sessionStorage.getItem("accessToken");

	if (!accessToken) return <Navigate to="/" replace />;

	return children;
};

export default ProtecteRoute;
