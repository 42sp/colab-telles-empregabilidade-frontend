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
import { socket } from "@/services/socketClient";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import type { Operation } from "@/types/operations";

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

// Dev logger (apenas em dev)
const isDev = import.meta.env.MODE === "development" || import.meta.env.MODE === "production";
const debugLog = (...args: any[]) => {
	if (isDev) console.debug("[ScrapOpContxt]", ...args);
};

export function ScrapOperationsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = useAuth();
	const [state, dispatch] = useReducer(reducer, initialState);
	const mountedRef = useRef(false);
	const processedRef = useRef<Set<string>>(new Set());

	// Helper para normalizar a resposta do scrapOperationsService.find
	const extractOpsFromFindResponse = (resp: any): Operation[] => {
		if (!resp) return [];
		if (Array.isArray(resp)) return resp;
		if (resp.data && Array.isArray(resp.data)) return resp.data;
		// caso o service já retorne { data, total }
		if (resp.data && Array.isArray(resp.data)) return resp.data;
		return [];
	};

	// ------------------------------
	// Load operations
	// ------------------------------
	const loadOperations = useCallback(async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			const resp = await scrapOperationsService.find({
				query: { $sort: { scheduled_date: 1, scheduled_time: 1 } },
			});
			const ops = extractOpsFromFindResponse(resp);
			debugLog("loadOperations -> ops count:", ops.length);
			if (mountedRef.current) dispatch({ type: "SET_ALL", payload: ops });
		} catch (err) {
			console.error("[ScrapOpsCtx] Erro ao carregar operações:", err);
			if (mountedRef.current)
				dispatch({ type: "SET_ERROR", payload: "Erro ao carregar operações" });
		} finally {
			if (mountedRef.current) dispatch({ type: "SET_LOADING", payload: false });
		}
	}, []);

	useEffect(() => {
		mountedRef.current = true;
		void loadOperations();
		return () => {
			mountedRef.current = false;
		};
	}, [loadOperations]);

	// dedupe key: só id + status (menos propenso a false negatives)
	const makeKey = (op: Partial<Operation>) =>
		`${String(op?.id ?? "no-id")}::${String(op?.status ?? "no-status")}`;

	// ------------------------------
	// WebSocket listeners
	// ------------------------------
	useEffect(() => {
		const log = (label: string, data: any) => debugLog(`[WS] ${label}:`, data);

		const handlePatched = (op: Operation & { _source?: string }) => {
			// dedupe/short-circuit
			const key = makeKey(op);
			if (processedRef.current.has(key)) return;
			processedRef.current.add(key);
			// remove key after short interval
			setTimeout(() => processedRef.current.delete(key), 5000);

			if (!mountedRef.current) return;

			dispatch({ type: "UPSERT", payload: op });
			log("patched", { id: op.id, status: op.status, source: op._source });

			if (op._source === "cronjob") {
				const toastId = `ws-patched-${op.id}`;
				if (!toast.isActive(toastId)) {
					const message =
						op.status === "Concluído"
							? `Operação "${op.name}" concluída automaticamente`
							: op.status === "Em Execução"
								? `Operação "${op.name}" em execução... ⚙️`
								: op.status === "Falha"
									? `Operação "${op.name}" falhou (cronjob)`
									: `Operação "${op.name}" atualizada pelo cronjob`;

					const type =
						op.status === "Falha"
							? "error"
							: op.status === "Em Execução"
								? "info"
								: "success";

					// react-toastify - update/create a toast
					toast(message as React.ReactNode, { toastId, type });
				}
			}
		};

		const handleCreated = (op: Operation) => {
			const key = makeKey(op);
			if (processedRef.current.has(key)) return;
			processedRef.current.add(key);
			setTimeout(() => processedRef.current.delete(key), 5000);
			if (!mountedRef.current) return;
			dispatch({ type: "UPSERT", payload: op });
			log("created", { id: op.id, name: op.name });
		};

		const handleRemoved = (op: Operation) => {
			const key = makeKey(op);
			if (processedRef.current.has(key)) return;
			processedRef.current.add(key);
			setTimeout(() => processedRef.current.delete(key), 5000);
			if (!mountedRef.current) return;
			dispatch({ type: "REMOVE", payload: op.id });
			log("removed", { id: op.id, name: op.name });

			const toastId = `ws-removed-${op.id}`;
			if (!toast.isActive(toastId))
				toast(`Operação removida: "${op.name}" 🗑️`, { toastId });
		};

		// registra listeners do serviço Feathers (encapsulado no cliente)
		scrapOperationsService.on("patched", handlePatched);
		scrapOperationsService.on("created", handleCreated);
		scrapOperationsService.on("removed", handleRemoved);

		// registra onAny do socket (apenas se socket disponível) — cleanup também
		let anyHandler: ((event: string, ...args: any[]) => void) | undefined;
		if (socket?.onAny) {
			anyHandler = (event: string, ...args: any[]) => {
				try {
					const payload = args?.[0] ?? args;
					const opCandidate = Array.isArray(payload) ? payload[0] : payload;
					if (!opCandidate?.id) return;
					const ev = event.split(/[:\s]/).pop()?.toLowerCase();
					if (ev === "patched") handlePatched(opCandidate);
					else if (ev === "created") handleCreated(opCandidate);
					else if (ev === "removed") handleRemoved(opCandidate);
				} catch (err) {
					console.warn("[ScrapOpsCtx] socket.onAny handler error:", err);
				}
			};
			socket.onAny(anyHandler);
		}

		// cleanup: sempre remove os listeners registrados acima
		return () => {
			try {
				scrapOperationsService.off("patched", handlePatched);
				scrapOperationsService.off("created", handleCreated);
				scrapOperationsService.off("removed", handleRemoved);
			} catch (err) {
				// off pode falhar se o service não suportar; ignorar em cleanup
				debugLog("Erro ao remover listeners do service:", err);
			}
			if (anyHandler) socket?.offAny?.(anyHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // intencional: registrar apenas uma vez durante o ciclo de vida do provider

	// ------------------------------
	// CRUD actions
	// ------------------------------
	const runOperation = useCallback(
		async (id: string | number) => {
			const op = state.operations.find(op => String(op.id) === String(id));
			if (!op) return;
			const tid = `run-${id}`;
			if (!toast.isActive(tid))
				toast(`${op.name} ➜ execução iniciada ⚙️`, {
					toastId: tid,
					autoClose: 3000,
				});
		},
		[state.operations]
	);

	const refresh = useCallback(async () => {
		if (mountedRef.current) await loadOperations();
	}, [loadOperations]);

	const createOperation = useCallback(
		async (payload: Partial<Operation>): Promise<Operation | null> => {
			const tid = `create-temp-${payload.name ?? "op"}-${Date.now()}`;
			if (!toast.isActive(tid))
				toast.loading("Criando operação...", { toastId: tid });

			try {
				const created = await scrapOperationsService.create(payload);
				if (!mountedRef.current || !created) {
					toast.update(tid, {
						render: "Não foi possível criar a operação",
						type: "error",
						isLoading: false,
						autoClose: 3000,
					} as any);
					return null;
				}
				dispatch({ type: "UPSERT", payload: created });
				toast.update(tid, {
					render: `Operação "${created.name}" criada com sucesso! 🆕`,
					type: "success",
					isLoading: false,
					autoClose: 3000,
				} as any);
				return created;
			} catch (err) {
				console.error("[ScrapOpsCtx.createOperation] erro:", err);
				toast.update(tid, {
					render: "Erro ao criar operação ❌",
					type: "error",
					isLoading: false,
					autoClose: 3000,
				} as any);
				return null;
			}
		},
		[]
	);

	const updateOperation = useCallback(
		async (
			id: string | number,
			patch: Partial<Operation>
		): Promise<Operation | null> => {
			const tid = `update-${id}`;
			if (!toast.isActive(tid))
				toast.loading("Atualizando operação...", { toastId: tid });

			try {
				const updated = await scrapOperationsService.patch(id, patch, {
					source: "edit",
				});
				if (!mountedRef.current || !updated) {
					toast.update(tid, {
						render: "Erro ao atualizar operação",
						type: "error",
						isLoading: false,
						autoClose: 3000,
					} as any);
					return null;
				}
				dispatch({ type: "UPSERT", payload: updated });
				toast.update(tid, {
					render: `Operação "${updated.name}" editada com sucesso! ✍️`,
					type: "success",
					isLoading: false,
					autoClose: 2000,
				} as any);
				return updated;
			} catch (err) {
				console.error("[ScrapOpsCtx.updateOperation] erro:", err);
				toast.update(tid, {
					render: "Erro ao atualizar operação ❌",
					type: "error",
					isLoading: false,
					autoClose: 3000,
				} as any);
				return null;
			}
		},
		[]
	);

	const deleteOperation = useCallback(
		async (id: string | number): Promise<boolean> => {
			if (!id) return false;
			const tid = `delete-${id}`;
			if (!toast.isActive(tid))
				toast.loading("Excluindo operação... 🗑️", { toastId: tid });

			try {
				const deletedBy =
					(user as any)?.id || (user as any)?._id || user?.name || "unknown";
				const serverOp = await scrapOperationsService.softDelete(
					id,
					deletedBy,
					{
						source: "delete",
					}
				);

				if (!mountedRef.current) {
					if (toast.isActive(tid))
						toast.update(tid, {
							render: "Operação excluída (interface desconectada).",
							type: "success",
							isLoading: false,
							autoClose: 2500,
						} as any);
					return true;
				}

				if (serverOp) {
					dispatch({ type: "UPSERT", payload: serverOp });
					toast.update(tid, {
						render: `Operação "${serverOp.name}" excluída com sucesso! 🗑️`,
						type: "success",
						isLoading: false,
						autoClose: 2500,
					} as any);
				} else {
					dispatch({ type: "REMOVE", payload: id });
					toast.update(tid, {
						render: `Operação removida.`,
						type: "success",
						isLoading: false,
						autoClose: 2500,
					} as any);
				}

				return true;
			} catch (err) {
				console.error("[ScrapOpsCtx.deleteOperation] erro:", err);
				toast.update(tid, {
					render: "Erro ao excluir operação ❌",
					type: "error",
					isLoading: false,
					autoClose: 3000,
				} as any);
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

	const actions = useMemo(
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
