import { feathers } from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import axios from 'axios';

const restClient = rest(import.meta.env.VITE_API_URL);

// Cria a instância principal
const api = feathers();
api.configure(restClient.axios(axios)); // ← Aqui trocamos fetch por axios

// Serviço Scrap Operations
export const scrapService = api.service('scrap-operations');

export default api;
