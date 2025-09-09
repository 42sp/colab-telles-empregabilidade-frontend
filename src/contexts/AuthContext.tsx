import { createContext, useContext, useState, useEffect } from "react";
import {
	socket,
	authenticateWithToken,
	reauthenticate,
	logout as feathersLogout,
} from "@/services/socketClient";

type User = { id: number; email: string; name?: string };

type AuthContextType = {
	user: User | null;
	setUser: (user: User | null) => void;
	login: (accessToken: string, user: User) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	/**
	 * Reautenticação automática ao carregar o app
	 */
	useEffect(() => {
		const initAuth = async () => {
			const token = localStorage.getItem("user")
				? sessionStorage.getItem("accessToken")
				: null;
			if (!token) return;

			const result = await reauthenticate();
			if (result?.user) {
				handleSetUser(result.user as User);
			} else {
				handleSetUser(null);
			}
		};
		void initAuth();
	}, []);

	/**
	 * Define o usuário no estado + localStorage
	 */
	const handleSetUser = (user: User | null) => {
		setUser(user);
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	};

	/**
	 * Login manual após receber token no fluxo de autenticação
	 */
	const login = async (accessToken: string, user: User) => {
		await authenticateWithToken(accessToken);
		handleSetUser(user);

		// Conecta socket caso ainda não esteja conectado
		if (socket && !socket.connected) {
			socket.connect();
		}
	};
	/**
	 * Logout global (Feathers + socket + estado)
	 */
	const logout = async () => {
		await feathersLogout();
		handleSetUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, setUser: handleSetUser, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
