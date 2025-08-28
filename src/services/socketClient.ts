// src/services/socketClient.ts
import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import rest from "@feathersjs/rest-client";
import authClient from "@feathersjs/authentication-client";

console.log("[STEP 1] Criando socket...");

const storedToken =
  (typeof window !== "undefined" &&
    (localStorage.getItem("feathers-jwt") ??
      localStorage.getItem("accessToken") ??
      localStorage.getItem("token"))) ||
  undefined;

const socketOptions: any = { transports: ["websocket"] };
if (storedToken) {
  socketOptions.auth = { accessToken: storedToken };
  console.log(
    "[STEP 1] Token encontrado — adicionando ao handshake do socket (não substitui autenticação Feathers completa)."
  );
}

export const socket: Socket = io(import.meta.env.VITE_API_URL, socketOptions);
console.log("[STEP 1] Socket criado", socket.id ?? "(id ainda não definido)");

// conexão
socket.on("connect", () => console.log("[STEP 2] Socket conectado", socket.id));
socket.on("disconnect", () => console.log("[STEP 2] Socket desconectado"));
socket.on("connect_error", (err: any) =>
  console.error("[STEP 2] Erro de conexão:", err)
);

// debug: captura qualquer evento vindo do servidor
socket.onAny((event, ...args) => {
  console.log(`[STEP DEBUG] Evento recebido do servidor: ${event}`, args);
});

console.log("[STEP 3] Configurando Feathers com Socket.IO e REST...");
const client = feathers();

// WS
client.configure(socketio(socket));

// REST
const restClient = rest(import.meta.env.VITE_API_URL);
client.configure(restClient.axios(axios));

// plugin de auth do cliente (opcional)
try {
  client.configure(
    // @ts-ignore - caso sua versão seja ligeiramente diferente
    authClient({ storage: window.localStorage })
  );
} catch (err) {
  console.warn("[STEP 3] auth client plugin não carregado:", err);
}

console.log("[STEP 3] Feathers configurado com WS e REST");

(async () => {
  try {
    // tenta re-autenticar se o client suportar
    // @ts-ignore
    if (client.reAuthenticate) {
      await client.reAuthenticate();
      console.log("[STEP 3] Feathers client re-autenticado automaticamente (se havia token válido).");
    }
  } catch (err: any) {
    console.log("[STEP 3] Re-auth falhou (normal se não estava autenticado):", err?.message ?? err);
  }
})();

export const scrapService = client.service("scrap-operations");
export default client;
