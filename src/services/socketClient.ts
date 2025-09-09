import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import rest from "@feathersjs/rest-client";
import authClient from "@feathersjs/authentication-client";

/**
 * Configura cliente Feathers com Socket.IO + REST de forma segura:
 * - Usa authClient (localStorage) para persistência de sessão
 * - Permite autenticar manualmente após login com accessToken
 * - Suporta reautenticação automática em reloads
 */

// util: ambiente cliente?
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

// util: controle de debug (use NODE_ENV)
const isDev =
  typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true;
const log = (...args: any[]) => {
  if (isDev) console.debug("[socketClient]", ...args);
};

// Criar socket mas NÃO conectar automaticamente (autoConnect: false)
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
const SOCKET_URL = import.meta.env.VITE_API_URL as string;
const socketOptions: any = {
  transports: ["websocket"],
  autoConnect: false,
};

// Criar instância socket (SSR-safe: apenas cria se em browser)
export const socket: Socket | null = isBrowser ? io(SOCKET_URL, socketOptions) : null;

if (isBrowser && socket) {
  log("Socket instanciado (ainda não conectado).");
  socket.on("connect", () => log("Socket conectado", socket.id));
  socket.on("disconnect", (reason: any) =>
    log("Socket desconectado", reason)
  );
  socket.on("connect_error", (err: any) =>
    console.error("[socketClient] connect_error:", err)
  );

  // DEBUG extra
  if (isDev) {
    socket.onAny((event, ...args) => {
      console.debug(`[socketClient DEBUG] Evento recebido: ${event}`, args);
    });
  }
} else {
  log("Não é ambiente browser — socket não instanciado.");
}

// Configurar Feathers client
const client = feathers();

// WS (se socket disponível)
if (socket) client.configure(socketio(socket));

// REST
const restClient = rest(SOCKET_URL);
client.configure(restClient.axios(axios));

// auth client (SSR-safe)
if (isBrowser) {
  try {
    client.configure(
      authClient({ storage: window.localStorage }) // 🔑 sempre localStorage
    );
  } catch (err) {
    console.warn("[socketClient] auth client plugin não carregado:", err);
  }
} else {
  log("Não configurando auth client (SSR).");
}

/**
 * Helpers de autenticação
 */

// Autenticar manualmente após login
export async function authenticateWithToken(accessToken: string) {
  try {
    await client.authenticate({ strategy: "jwt", accessToken });
    log("Autenticado com JWT");
  } catch (err) {
    console.error("[socketClient] Falha ao autenticar com JWT:", err);
    throw err;
  }
}

// Reautenticar automaticamente (se token válido no storage)
export async function reauthenticate() {
  if (!isBrowser) return null;
  try {
    const result = await client.reAuthenticate();
    log("Reautenticação bem-sucedida:", result);
    if (socket && !socket.connected) {
      socket.connect();
    }
    return result;
  } catch (err) {
    console.warn("[socketClient] Reautenticação falhou:", err);
    return null;
  }
}

// Logout (encerra sessão no feathers e desconecta socket)
export async function logout() {
  try {
    await client.logout();
    log("Logout realizado");
  } catch (err) {
    console.error("[socketClient] Erro no logout:", err);
  }
  if (socket && socket.connected) {
    socket.disconnect();
  }
}

export const scrapService = client.service("scrap-operations");
export default client;


// import { feathers } from "@feathersjs/feathers";
// import socketio from "@feathersjs/socketio-client";
// import { io, Socket } from "socket.io-client";
// import axios from "axios";
// import rest from "@feathersjs/rest-client";
// import authClient from "@feathersjs/authentication-client";

// // SSR-safe
// const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
// const isDev = typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true;
// const log = (...args: any[]) => { if (isDev) console.debug("[socketClient]", ...args); };

// // --- URLs de backend ---
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3030"; // REST
// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL; // WebSocket

// // --- Opções do socket ---
// const socketOptions = { transports: ["websocket"], autoConnect: false };

// // --- Criar instância do socket ---
// export const socket: Socket | null = isBrowser ? io(SOCKET_URL, socketOptions) : null;

// if (isBrowser && socket) {
//   log("Socket instanciado (ainda não conectado).");

//   socket.on("connect", () => log("Socket conectado", socket.id));
//   socket.on("disconnect", reason => log("Socket desconectado", reason));
//   socket.on("connect_error", err => console.error("[socketClient] connect_error:", err));

//   if (isDev) {
//     socket.onAny((event, ...args) => console.debug(`[socketClient DEBUG] Evento recebido: ${event}`, args));
//   }
// } else {
//   log("Não é ambiente browser — socket não instanciado.");
// }

// // --- Feathers client ---
// const client = feathers();

// // Configurar WebSocket
// if (socket) client.configure(socketio(socket));

// // Configurar REST
// const restClient = rest(API_URL);
// client.configure(restClient.axios(axios));

// // Configurar autenticação JWT
// if (isBrowser) {
//   try {
//     client.configure(authClient({ storage: window.localStorage }));
//   } catch (err) {
//     console.warn("[socketClient] auth client plugin não carregado:", err);
//   }
// }

// // --- Helpers ---
// export async function authenticateWithToken(accessToken: string) {
//   try {
//     await client.authenticate({ strategy: "jwt", accessToken });
//     log("Autenticado com JWT");
//     if (socket && !socket.connected) socket.connect();
//   } catch (err) {
//     console.error("[socketClient] Falha ao autenticar com JWT:", err);
//     throw err;
//   }
// }

// export async function reauthenticate() {
//   if (!isBrowser) return null;
//   try {
//     const result = await client.reAuthenticate();
//     log("Reautenticação bem-sucedida:", result);
//     if (socket && !socket.connected) socket.connect();
//     return result;
//   } catch (err) {
//     console.warn("[socketClient] Reautenticação falhou:", err);
//     return null;
//   }
// }

// export async function logout() {
//   try {
//     await client.logout();
//     log("Logout realizado");
//   } catch (err) {
//     console.error("[socketClient] Erro no logout:", err);
//   }
//   if (socket && socket.connected) socket.disconnect();
// }

// // --- Serviços ---
// export const scrapService = client.service("scrap-operations");
// export default client;
