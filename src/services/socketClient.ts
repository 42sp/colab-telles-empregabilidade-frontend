import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import rest from "@feathersjs/rest-client";
import authClient from "@feathersjs/authentication-client";

/**
 * Configura cliente Feathers com Socket.IO + REST de forma segura:
 * - Não acessa localStorage/`window` sem checar environment (SSR-safe).
 * - Não inclui token no handshake de forma "hacky"; tenta re-autenticar via authClient.
 * - Conecta socket apenas após configurar (e opcionalmente autenticar).
 */

// util: ambiente cliente?
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

// util: leitura segura do token do localStorage
const getStoredToken = (): string | undefined => {
  if (!isBrowser) return undefined;
  return (
    localStorage.getItem("feathers-jwt") ??
    localStorage.getItem("accessToken") ??
    localStorage.getItem("token") ??
    undefined
  );
};

// util: controle de debug (use NODE_ENV)
const isDev = typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true;
const log = (...args: any[]) => {
  if (isDev) console.debug("[socketClient]", ...args);
};

// Criar socket mas NÃO conectar automaticamente (autoConnect: false)
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
  socket.on("disconnect", (reason: any) => log("Socket desconectado", reason));
  socket.on("connect_error", (err: any) => console.error("[socketClient] connect_error:", err));

  // DEBUG: só em dev
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
      // storage: window.localStorage garante persistência padrão do auth plugin
      authClient({ storage: window.localStorage })
    );
  } catch (err) {
    console.warn("[socketClient] auth client plugin não carregado:", err);
  }
} else {
  log("Não configurando auth client (SSR).");
}

// Função que tenta re-autenticar usando token existente (se houver)
async function tryReauthenticateAndConnect() {
  if (!isBrowser) return;

  const token = getStoredToken();

  if (token) {
    try {
      log("Token encontrado. Tentando re-autenticar via client.authenticate...");
      // Tentativa de re-autenticação com accessToken
      // Se falhar, apenas continuamos — socket será conectado sem token.
      // @ts-ignore - client.authenticate existe quando authClient foi configurado
      await client.authenticate({ strategy: "jwt", accessToken: token });
      log("Re-autenticação bem-sucedida.");
    } catch (err: any) {
      // re-auth pode falhar (ex.: token expirado) — isso é esperado às vezes
      console.warn("[socketClient] Re-auth falhou:", err?.message ?? err);
    }
  } else {
    log("Nenhum token encontrado para re-autenticar.");
  }

  // Conecta o socket (com ou sem autenticação anterior)
  if (socket && !socket.connected) {
    try {
      socket.connect();
      log("Socket.connect() chamado.");
    } catch (err) {
      console.error("[socketClient] Falha ao conectar socket:", err);
    }
  }
}

// Tenta re-auth + connect apenas se estivermos no browser
if (isBrowser) {
  // Chamamos async sem bloquear carregamento
  void tryReauthenticateAndConnect();
}

// Exportar serviço Feathers para uso (nome do serviço)
export const scrapService = client.service("scrap-operations");

// Export default client (caso precise)
export default client;
