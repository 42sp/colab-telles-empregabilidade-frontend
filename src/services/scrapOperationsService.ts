import { scrapService } from './socketClient';
import type { Operation } from '@/types/operations';
import type { ScrapParams } from '@/types/ScrapParams';

export const scrapOperationsService = {
  async find(query?: any): Promise<Operation[] | { data: Operation[] }> {
    console.log("[STEP 4] Chamando REST find com query:", query);
    const resp = await scrapService.find(query);
    console.log("[STEP 4] REST find resposta:", resp);
    return (resp as any)?.data ?? (resp as any) ?? [];
  },

  async create(payload: Partial<Operation>): Promise<Operation> {
    console.log("[STEP 5] Criando operação via WS:", payload);
    const op = await scrapService.create(payload);
    console.log("[STEP 5] Operação criada:", op);
    return op;
  },

  async patch(id: number | string, data: Partial<Operation>, params?: ScrapParams): Promise<Operation> {
    console.log("[STEP 6] Atualizando operação via WS:", { id, data, params });
    const op = await scrapService.patch(id, data, params);
    console.log("[STEP 6] Operação atualizada:", op);
    return op;
  },

  async softDelete(id: number | string, deletedBy: string, params?: ScrapParams): Promise<Operation | null> {
    console.log("[STEP 7] Soft delete operação:", id);
    const op = await scrapService.patch(id, {
      deleted: true,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy,
    }, params);
    console.log("[STEP 7] Operação soft deleted:", op);
    return op;
  },

  // Eventos WS
  on(event: string, callback: (op: Operation) => void) {
    console.log(`[STEP 8] Registrando listener WS para evento: ${event}`);
    scrapService.on(event, callback);
  },

  off(event: string, callback: (op: Operation) => void) {
    console.log(`[STEP 8] Removendo listener WS para evento: ${event}`);
    scrapService.off(event, callback);
  },
};
