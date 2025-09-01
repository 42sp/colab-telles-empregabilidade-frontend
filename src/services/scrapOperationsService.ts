import { scrapService } from "./socketClient";
import type { Operation } from "@/types/operations";
import type { ScrapParams } from "@/types/ScrapParams";

/**
 * Helper utilities:
 * - normalizeFindResponse: converte diferentes formatos (WS paginated, REST axios, array) para um formato consistente.
 * - safeGetUserEmailFromStorage: lê localStorage de forma segura e retorna email.
 */

type FindResponse = Operation[] | { data: Operation[]; total?: number };

// Lista de fontes permitidas (evita magic strings espalhadas)
export type Source = "cronjob" | "user" | "delete" | "edit" | "unknown";

function normalizeFindResponse(resp: any): FindResponse {
  if (!resp) return [];
  // Feathers paginated { total, limit, skip, data }
  if (resp && Array.isArray(resp.data) && typeof resp.total === "number") {
    return { data: resp.data, total: resp.total };
  }
  // axios REST response: { data: [...] } OR { data: { data: [...] } } sometimes
  if (resp && resp.data && Array.isArray(resp.data)) {
    return resp.data;
  }
  // Sometimes axios returns an object wrapper: resp.data.data
  if (resp && resp.data && resp.data.data && Array.isArray(resp.data.data)) {
    return resp.data.data;
  }
  // Feathers socket find (non-paginated) may return array
  if (Array.isArray(resp)) return resp;
  // fallback: try resp.result / resp.items
  if (Array.isArray(resp.result)) return resp.result;
  if (Array.isArray(resp.items)) return resp.items;
  return [];
}

function safeGetUserEmailFromStorage(): string | undefined {
  try {
    if (typeof window === "undefined") return undefined;
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.email ?? parsed?.user?.email;
  } catch (err) {
    console.warn("[scrapOperationsService] Falha ao ler user do localStorage:", err);
    return undefined;
  }
}

export const scrapOperationsService = {
  async find(query?: any): Promise<FindResponse> {
    try {
      // Chama o service. Pode devolver formatos distintos dependendo do transporte (WS/REST).
      const resp = await scrapService.find(query);
      const normalized = normalizeFindResponse(resp);
      return normalized;
    } catch (err) {
      console.error("[scrapOperationsService.find] erro:", err);
      // retorna array vazio como fallback
      return [];
    }
  },

  async create(payload: Partial<Operation>): Promise<Operation | null> {
    try {
      const op = await scrapService.create(payload);
      return (op as Operation) ?? null;
    } catch (err) {
      console.error("[scrapOperationsService.create] erro:", err);
      throw err;
    }
  },

  async patch(
    id: number | string,
    data: Partial<Operation>,
    params?: ScrapParams & { source?: Source }
  ): Promise<Operation | null> {
    // pega email do localStorage de forma segura (se existir)
    const userEmail = safeGetUserEmailFromStorage() ?? "anonymous";

    try {
      const op = await scrapService.patch(id, {
        ...data,
        _source: (params?.source as Source) ?? ("user" as Source),
        _user: userEmail,
      });
      return (op as Operation) ?? null;
    } catch (err) {
      console.error("[scrapOperationsService.patch] erro:", err);
      throw err;
    }
  },

  async softDelete(
    id: number | string,
    deletedBy: string,
    params?: ScrapParams & { source?: Source }
  ): Promise<Operation | null> {
    try {
      const op = await scrapService.patch(
        id,
        {
          deleted: true,
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy,
          _source: (params?.source as Source) ?? ("delete" as Source),
        },
        params
      );
      return (op as Operation) ?? null;
    } catch (err) {
      console.error("[scrapOperationsService.softDelete] erro:", err);
      throw err;
    }
  },

  // Eventos WS (delegação leve — a remoção deve ser responsabilidade de quem registrou)
  on(event: string, callback: (op: Operation) => void) {
    try {
      scrapService.on(event, callback);
    } catch (err) {
      console.warn("[scrapOperationsService.on] erro ao registrar listener:", err);
    }
  },

  off(event: string, callback: (op: Operation) => void) {
    try {
      scrapService.off(event, callback);
    } catch (err) {
      console.warn("[scrapOperationsService.off] erro ao remover listener:", err);
    }
  },
};

export default scrapOperationsService;
