import React, {
	createContext,
	useContext,
	useReducer,
	useEffect,
	useCallback,
	useRef,
	useMemo,
} from "react";
import { scrapOperationsService } from "@/services/scrapOperationsService";
import type { Operation } from "@/types/operations";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

type State = {
	operations: Operation[];
	loading: boolean;
	error?: string | null;
};

type Actions = {
	createOperation: (payload: Partial<Operation>) => Promise<Operation | null>;
	updateOperation: (
		id: string | number,
		patch: Partial<Operation>
	) => Promise<Operation | null>;
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
			return {
				...state,
				operations: action.payload,
				loading: false,
				error: null,
			};
		case "UPSERT": {
			const idx = state.operations.findIndex(
				op => String(op.id) === String(action.payload.id)
			);
			if (idx === -1)
				return { ...state, operations: [action.payload, ...state.operations] };
			const ops = [...state.operations];
			ops[idx] = action.payload;
			return { ...state, operations: ops };
		}
		case "REMOVE":
			return {
				...state,
				operations: state.operations.filter(
					op => String(op.id) !== String(action.payload)
				),
			};
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

export function ScrapOperationsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = useAuth();
	const [state, dispatch] = useReducer(reducer, initialState);
	const mountedRef = useRef(false);

	// ------------------------------
	// Carregar operações iniciais
	// ------------------------------
	const loadOperations = useCallback(async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			const resp = await scrapOperationsService.find({
				query: { $sort: { scheduled_date: 1, scheduled_time: 1 } },
			});
			const ops = Array.isArray(resp) ? resp : (resp.data ?? []);
			if (mountedRef.current) dispatch({ type: "SET_ALL", payload: ops });
		} catch {
			if (mountedRef.current)
				dispatch({ type: "SET_ERROR", payload: "Erro ao carregar operações" });
		} finally {
			if (mountedRef.current) dispatch({ type: "SET_LOADING", payload: false });
		}
	}, []);

	useEffect(() => {
		mountedRef.current = true;
		loadOperations();
		return () => {
			mountedRef.current = false;
		};
	}, [loadOperations]);

	// WS: escuta eventos detalhados
	useEffect(() => {
		console.log("[WS] Iniciando escuta de eventos WebSocket...");

		const handlePatched = (op: Operation & { _source?: string }) => {
			if (!mountedRef.current) return;

			const source = op._source || "unknown";

			// Log detalhado
			console.groupCollapsed(
				`[WS] Evento 'patched' recebido (source: ${source})`
			);
			console.log("Operação completa:", op);
			console.log("Origem do patch (_source):", source);
			console.groupEnd();

			// Atualiza estado
			dispatch({ type: "UPSERT", payload: op });

			// Dispara toasts dependendo da origem
			switch (source) {
				case "cronjob":
					if (op.status === "Concluído")
						toast.success(`Operação "${op.name}" concluída automaticamente`);
					else if (op.status === "Em Execução")
						toast.info(`Operação "${op.name}" em execução... ⚙️`);
					else if (op.status === "Falha")
						toast.error(`Operação "${op.name}" falhou (cronjob)`);
					break;
				case "user":
					toast.info(`Operação "${op.name}" atualizada manualmente ✍️`);
					break;
				case "delete":
					toast.warn(`Operação "${op.name}" excluída pelo usuário 🗑️`);
					break;
				default:
					console.warn("[WS] Evento patched sem origem conhecida:", op);
			}
		};

		const handleCreated = (op: Operation) => {
			console.log("[WS] Evento 'created' recebido:", op);
			dispatch({ type: "UPSERT", payload: op });
			toast(`Nova operação criada: "${op.name}" 🆕`);
		};

		const handleRemoved = (op: Operation) => {
			console.log("[WS] Evento 'removed' recebido:", op);
			dispatch({ type: "REMOVE", payload: op.id });
			toast(`Operação removida: "${op.name}" 🗑️`);
		};

		// Registra eventos
		scrapOperationsService.on("patched", handlePatched);
		scrapOperationsService.on("created", handleCreated);
		scrapOperationsService.on("removed", handleRemoved);

		// Logs de conexão WS
		if ((scrapOperationsService as any).connection) {
			const conn = (scrapOperationsService as any).connection;
			conn.on("connect", () =>
				console.log("[WS] Conectado ao servidor WebSocket")
			);
			conn.on("disconnect", () =>
				console.log("[WS] Desconectado do servidor WebSocket")
			);
			conn.on("connect_error", (err: any) =>
				console.error("[WS] Erro de conexão:", err)
			);
		}

		// Cleanup
		return () => {
			scrapOperationsService.off("patched", handlePatched);
			scrapOperationsService.off("created", handleCreated);
			scrapOperationsService.off("removed", handleRemoved);
		};
	}, []);

	// ------------------------------
	// CRUD Actions
	// ------------------------------
	const runOperation = useCallback(
		async (id: string | number) => {
			const op = state.operations.find(op => String(op.id) === String(id));
			if (!op) return;
			toast(`Executando operação: ${op.name ?? op.id} ⚙️`);
		},
		[state.operations]
	);

	const refresh = useCallback(async () => {
		if (!mountedRef.current) return;
		await loadOperations();
	}, [loadOperations]);

	const createOperation = useCallback(async (payload: Partial<Operation>) => {
		try {
			const created = await scrapOperationsService.create(payload);
			if (!mountedRef.current || !created) return null;
			dispatch({ type: "UPSERT", payload: created });
			return created;
		} catch {
			toast.error("Erro ao criar operação");
			return null;
		}
	}, []);

	const updateOperation = useCallback(
		async (id: string | number, patch: Partial<Operation>) => {
			try {
				const updated = await scrapOperationsService.patch(id, patch, {
					source: "user",
				});
				if (!mountedRef.current || !updated) return null;
				dispatch({ type: "UPSERT", payload: updated });
				return updated;
			} catch {
				toast.error("Erro ao atualizar operação");
				return null;
			}
		},
		[]
	);

	const deleteOperation = useCallback(
		async (id: string | number) => {
			if (!id) return false;
			try {
				const deletedBy =
					(user as any)?.id || (user as any)?._id || user?.name || "unknown";
				const serverOp = await scrapOperationsService.softDelete(
					id,
					deletedBy,
					{ source: "delete" }
				);
				if (!mountedRef.current) return true;
				if (serverOp) dispatch({ type: "UPSERT", payload: serverOp });
				else dispatch({ type: "REMOVE", payload: id });
				toast.success("Operação excluída com sucesso");
				return true;
			} catch {
				toast.error("Erro ao excluir operação");
				return false;
			}
		},
		[user]
	);

	const findById = useCallback(
		(id: string | number) =>
			state.operations.find(op => String(op.id) === String(id)),
		[state.operations]
	);

	const actions = useMemo<Actions>(
		() => ({
			createOperation,
			updateOperation,
			deleteOperation,
			refresh,
			findById,
			runOperation,
		}),
		[
			createOperation,
			updateOperation,
			deleteOperation,
			refresh,
			findById,
			runOperation,
		]
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
	if (!ctx)
		throw new Error(
			"useOperationsState must be used within ScrapOperationsProvider"
		);
	return ctx;
}

export function useOperationsActions() {
	const ctx = useContext(OpsActionsContext);
	if (!ctx)
		throw new Error(
			"useOperationsActions must be used within ScrapOperationsProvider"
		);
	return ctx;
}
