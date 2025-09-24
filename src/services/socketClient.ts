import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import rest from "@feathersjs/rest-client";
import authClient from "@feathersjs/authentication-client";

/**
 * Configuração de logs centralizada:
 * - Ativável/desativável via VITE_SOCKET_LOGS
 * - Inclui timestamp e tag
 */
const ENABLE_LOGS = import.meta.env.VITE_SOCKET_LOGS === "true";

function log(...args: any[]) {
  if (!ENABLE_LOGS) return;
  console.debug(`[socketClient ${new Date().toISOString()}]`, ...args);
}

function logInfo(...args: any[]) {
  if (!ENABLE_LOGS) return;
  console.info(`[socketClient ${new Date().toISOString()}]`, ...args);
}

function logWarn(...args: any[]) {
  if (!ENABLE_LOGS) return;
  console.warn(`[socketClient ${new Date().toISOString()}]`, ...args);
}

function logError(...args: any[]) {
  if (!ENABLE_LOGS) return;
  console.error(`[socketClient ${new Date().toISOString()}]`, ...args);
}

// SSR-safe
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

// --- URLs de backend ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3030";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;
logInfo("API_URL:", API_URL, "SOCKET_URL:", SOCKET_URL);

// --- Opções do socket ---
const socketOptions = { transports: ["websocket"], autoConnect: false };

// --- Instância do socket ---
export const socket: Socket | null = isBrowser ? io(SOCKET_URL, socketOptions) : null;

if (isBrowser && socket) {
  logInfo("Socket instanciado (ainda não conectado). URL:", SOCKET_URL);

  socket.on("connect", () => {
    logInfo("Socket conectado", { id: socket.id, url: SOCKET_URL });
  });

  socket.on("disconnect", reason => {
    logWarn("Socket desconectado", { reason, url: SOCKET_URL });
  });

  socket.on("connect_error", err => {
    logError("connect_error:", err, { url: SOCKET_URL });
  });

  socket.onAny((event, ...args) => {
    log("[Evento WS recebido]", event, args);
  });
} else {
  logWarn("Não é ambiente browser — socket não instanciado.");
}

// --- Feathers client ---
const client = feathers();

// Configurar WebSocket
if (socket) client.configure(socketio(socket));

// Configurar REST
const restClient = rest(API_URL);
client.configure(restClient.axios(axios));

// Configurar autenticação JWT
if (isBrowser) {
  try {
    client.configure(authClient({ storage: window.localStorage }));
  } catch (err) {
    logWarn("auth client plugin não carregado:", err);
  }
}

// --- Helpers ---
export async function authenticateWithToken(accessToken: string) {
  try {
    await client.authenticate({ strategy: "jwt", accessToken });
    logInfo("Autenticado com JWT");
    if (socket && !socket.connected) {
      socket.connect();
      logInfo("Tentativa de conectar socket após autenticação");
    }
  } catch (err) {
    logError("Falha ao autenticar com JWT:", err);
    throw err;
  }
}

export async function reauthenticate() {
  if (!isBrowser) return null;
  try {
    const result = await client.reAuthenticate();
    logInfo("Reautenticação bem-sucedida:", result);
    if (socket && !socket.connected) {
      socket.connect();
      logInfo("Tentativa de reconectar socket após reautenticação");
    }
    return result;
  } catch (err) {
    logWarn("Reautenticação falhou:", err);
    return null;
  }
}

export async function logout() {
  try {
    await client.logout();
    logInfo("Logout realizado");
  } catch (err) {
    logError("Erro no logout:", err);
  }
  if (socket && socket.connected) {
    socket.disconnect();
    logInfo("Socket desconectado manualmente no logout");
  }
}

// --- Serviços ---
export const scrapService = client.service("scrap-operations");
export default client;
