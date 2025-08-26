import api from "./api";
import type { Operation } from "@/types/operations";
import type { ScrapParams } from "@/types/ScrapParams";

const scrapService = api.service("scrap-operations");

export const scrapOperationsService = {
  async find(query?: any): Promise<Operation[] | { data: Operation[] }> {
    const resp = await scrapService.find(query);
    return (resp as any)?.data ?? (resp as any) ?? [];
  },

  async create(payload: Partial<Operation>): Promise<Operation> {
    return await scrapService.create(payload);
  },

  async patch(
    id: number | string,
    data: Partial<Operation>,
    params?: ScrapParams
  ): Promise<Operation> {
    // 🔹 Aqui passamos ScrapParams, que estende Params, correto para TS
    return await scrapService.patch(id, data, params);
  },

  async softDelete(
    id: number | string,
    deletedBy: string,
    params?: ScrapParams
): Promise<Operation | null> {
    return await scrapService.patch(
        id,
        {
            deleted: true,
            deleted_at: new Date().toISOString(),
            deleted_by: deletedBy,
        },
        params
    );
},

  on(event: string, callback: (op: Operation) => void) {
    scrapService.on(event, callback);
  },

  off(event: string, callback: (op: Operation) => void) {
    scrapService.off(event, callback);
  },
};
