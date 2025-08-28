import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import { io } from "socket.io-client";
import axios from "axios";
import rest from "@feathersjs/rest-client";

console.log("[STEP 1] Criando socket...");
const socket = io(import.meta.env.VITE_API_URL, {
	transports: ["websocket"],
});
console.log("[STEP 1] Socket criado", socket);

// Logs de conexão
socket.on("connect", () => console.log("[STEP 2] Socket conectado", socket.id));
socket.on("disconnect", () => console.log("[STEP 2] Socket desconectado"));
socket.on("connect_error", err =>
	console.error("[STEP 2] Erro de conexão:", err)
);

// Debug: captura qualquer evento do servidor
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

console.log("[STEP 3] Feathers configurado com WS e REST");

// Exporta o mesmo service para REST e WS
export const scrapService = client.service("scrap-operations");
