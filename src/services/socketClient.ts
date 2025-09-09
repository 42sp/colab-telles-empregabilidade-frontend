import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import rest from "@feathersjs/rest-client";
import authClient from "@feathersjs/authentication-client";

/**
 * Cliente Feathers seguro:
 * - WebSocket + REST
 * - JWT com localStorage
 * - Auto-reautenticação e auto-connect do socket
 */

// SSR-safe
const isBrowser =
	typeof window !== "undefined" && typeof window.document !== "undefined";

// Dev mode para logs
const isDev =
	typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true;
const log = (...args: any[]) => {
	if (isDev) console.debug("[socketClient]", ...args);
};

// --- URLs de backend ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3030";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;

// --- Opções do socket ---
const socketOptions = { transports: ["websocket"], autoConnect: false };

// --- Instância do socket ---
export const socket: Socket | null = isBrowser
	? io(SOCKET_URL, socketOptions)
	: null;

if (isBrowser && socket) {
	log("Socket instanciado (ainda não conectado).");

	socket.on("connect", () => log("Socket conectado", socket.id));
	socket.on("disconnect", reason => log("Socket desconectado", reason));
	socket.on("connect_error", err =>
		console.error("[socketClient] connect_error:", err)
	);

	if (isDev) {
		socket.onAny((event, ...args) =>
			console.debug(`[socketClient DEBUG] Evento recebido: ${event}`, args)
		);
	}
} else {
	log("Não é ambiente browser — socket não instanciado.");
}

// --- Feathers client ---
const client = feathers();

// Configurar WebSocket
if (socket) client.configure(socketio(socket));

// Configurar REST
const restClient = rest(API_URL);
client.configure(restClient.axios(axios));

// Configurar autenticação JWT (SSR-safe)
if (isBrowser) {
	try {
		client.configure(authClient({ storage: window.localStorage }));
	} catch (err) {
		console.warn("[socketClient] auth client plugin não carregado:", err);
	}
}

// --- Helpers ---
export async function authenticateWithToken(accessToken: string) {
	try {
		await client.authenticate({ strategy: "jwt", accessToken });
		log("Autenticado com JWT");
		// Auto-connect do socket após autenticação
		if (socket && !socket.connected) socket.connect();
	} catch (err) {
		console.error("[socketClient] Falha ao autenticar com JWT:", err);
		throw err;
	}
}

export async function reauthenticate() {
	if (!isBrowser) return null;
	try {
		const result = await client.reAuthenticate();
		log("Reautenticação bem-sucedida:", result);
		if (socket && !socket.connected) socket.connect();
		return result;
	} catch (err) {
		console.warn("[socketClient] Reautenticação falhou:", err);
		return null;
	}
}

export async function logout() {
	try {
		await client.logout();
		log("Logout realizado");
	} catch (err) {
		console.error("[socketClient] Erro no logout:", err);
	}
	if (socket && socket.connected) socket.disconnect();
}

// --- Serviços ---
export const scrapService = client.service("scrap-operations");
export default client;
