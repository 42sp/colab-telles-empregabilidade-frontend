import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { scrapService } from "@/services/api";
import type { Operation } from "@/types/operations";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

type State = {
  operations: Operation[];
  loading: boolean;
  error?: string | null;
};

type Actions = {
  createOperation: (payload: Partial<Operation>) => Promise<Operation | null>;
  updateOperation: (id: string | number, patch: Partial<Operation>) => Promise<Operation | null>;
  deleteOperation: (id: string | number) => Promise<boolean>;
  refresh: () => Promise<void>;
  findById: (id: string | number) => Operation | undefined;
  runOperation: (id: string | number) => Promise<void>;
};

const initialState: State = { operations: [], loading: true, error: null };

type Action =
  | { type: "SET_ALL"; payload: Operation[] }
  | { type: "UPSERT"; payload: Operation }
  | { type: "REMOVE"; payload: string | number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, operations: action.payload, loading: false, error: null };
    case "UPSERT": {
      const idx = state.operations.findIndex(op => String(op.id) === String(action.payload.id));
      if (idx === -1) return { ...state, operations: [action.payload, ...state.operations] };
      const ops = [...state.operations];
      ops[idx] = action.payload;
      return { ...state, operations: ops };
    }
    case "REMOVE":
      return { ...state, operations: state.operations.filter(op => String(op.id) !== String(action.payload)) };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const OpsStateContext = createContext<State | undefined>(undefined);
const OpsActionsContext = createContext<Actions | undefined>(undefined);

/** Util: calcula status derivado */
function computeStatus(op: Operation): Operation {
  if (op.deleted) return { ...op, status: "Excluída" };
  const today = new Date().toLocaleDateString("sv-SE");
  if (op.scheduled_date && op.scheduled_date < today) {
    return { ...op, status: "Vencida" };
  }
  return { ...op };
}

export function ScrapOperationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const load = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const resp = await scrapService.find({ query: { $sort: { scheduled_date: 1, scheduled_time: 1 } } });
        const ops: Operation[] = (resp as any)?.data ?? (resp as any) ?? [];
        if (mountedRef.current) dispatch({ type: "SET_ALL", payload: ops.map(computeStatus) });
      } catch { if (mountedRef.current) dispatch({ type: "SET_ERROR", payload: "Erro ao carregar operações" }); }
      finally { if (mountedRef.current) dispatch({ type: "SET_LOADING", payload: false }); }
    };
    load();
    return () => { mountedRef.current = false; };
  }, []);

  const runOperation = useCallback(
    async (id: string | number) => {
      const op = state.operations.find(op => String(op.id) === String(id));
      if (!op) {
        toast.error("Operação não encontrada");
        return;
      }
      toast(`Executando operação: ${op.name ?? op.id}`, { icon: "⚙️" });
      console.log(`🚀 Executando operação ${op.id} (${op.name})...`);
    },
    [state.operations]
  );

  const refresh = useCallback(async () => {
    if (!mountedRef.current) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const resp = await scrapService.find({
        query: { $sort: { scheduled_date: 1, scheduled_time: 1 } },
      });
      if (!mountedRef.current) return;
      const ops: Operation[] = (resp as any)?.data ?? (resp as any) ?? [];
      dispatch({ type: "SET_ALL", payload: ops.map(computeStatus) });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch {
      if (mountedRef.current) dispatch({ type: "SET_ERROR", payload: "Erro ao atualizar" });
    } finally {
      if (mountedRef.current) dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const createOperation = useCallback(async (payload: Partial<Operation>) => {
    try {
      const resp = await scrapService.create(payload);
      const created: Operation = (resp as any)?.data ?? (resp as any);
      if (!mountedRef.current) return null;
      if (created) dispatch({ type: "UPSERT", payload: computeStatus(created) });
      return created ?? null;
    } catch {
      toast.error("Erro ao criar operação");
      return null;
    }
  }, []);

  const updateOperation = useCallback(async (id: string | number, patch: Partial<Operation>) => {
    try {
      const resp = await scrapService.patch(id, patch);
      const updated: Operation = (resp as any)?.data ?? (resp as any);
      if (!mountedRef.current) return null;
      if (updated) dispatch({ type: "UPSERT", payload: computeStatus(updated) });
      return updated ?? null;
    } catch {
      toast.error("Erro ao atualizar operação");
      return null;
    }
  }, []);

  const deleteOperation = useCallback(async (id: string | number) => {
    if (!id) return false;
    try {
      const deletedBy =
        (user as any)?.id ||
        (user as any)?._id ||
        user?.name ||
        "unknown";

      const resp = await scrapService.patch(id, {
        deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy,
      });

      const serverOp: Operation | undefined = (resp as any)?.data ?? (resp as any);
      if (!mountedRef.current) return true;

      if (serverOp) {
        dispatch({ type: "UPSERT", payload: computeStatus(serverOp) });
      } else {
        dispatch({ type: "REMOVE", payload: id });
      }

      toast.success("Operação excluída com sucesso");
      return true;
    } catch {
      toast.error("Erro ao excluir operação");
      return false;
    }
  }, [user]);

  const findById = useCallback((id: string | number) => {
    return state.operations.find(op => String(op.id) === String(id));
  }, [state.operations]);

  // Atualiza status “Vencida/Excluída” a cada minuto
  useEffect(() => {
    if (!mountedRef.current) return;
    const timer = setInterval(() => {
      state.operations.forEach(op => {
        const newOp = computeStatus(op);
        if (newOp.status !== op.status) {
          dispatch({ type: "UPSERT", payload: newOp });
        }
      });
    }, 10_000);
    return () => clearInterval(timer);
  }, [state.operations]);

  const actions = useMemo<Actions>(
    () => ({
      createOperation,
      updateOperation,
      deleteOperation,
      refresh,
      findById,
      runOperation,
    }),
    [createOperation, updateOperation, deleteOperation, refresh, findById, runOperation]
  );

  return (
    <OpsStateContext.Provider value={state}>
      <OpsActionsContext.Provider value={actions}>
        {children}
      </OpsActionsContext.Provider>
    </OpsStateContext.Provider>
  );
}

export function useOperationsState() {
  const ctx = useContext(OpsStateContext);
  if (!ctx) throw new Error("useOperationsState must be used within ScrapOperationsProvider");
  return ctx;
}

export function useOperationsActions() {
  const ctx = useContext(OpsActionsContext);
  if (!ctx) throw new Error("useOperationsActions must be used within ScrapOperationsProvider");
  return ctx;
}
