import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useOperationsState } from "@/contexts/ScrapOperationsContext";

function formatDate(dateStr?: string) {
	if (!dateStr) return "-";
	const d = new Date(dateStr);
	const day = String(d.getUTCDate()).padStart(2, "0");
	const month = String(d.getUTCMonth() + 1).padStart(2, "0");
	const year = d.getUTCFullYear();
	return `${day}/${month}/${year}`;
}

export function OperationHistory() {
	const { operations } = useOperationsState();

	// ------------------------------
	// Filtra operações concluídas ou excluídas
	// ------------------------------
	const filteredOperations = useMemo(() => {
		return operations.filter(op => op.deleted || op.status === "Concluído");
	}, [operations]);

	// ------------------------------
	// Preencher mínimo de 6 linhas visuais
	// ------------------------------
	const paddedOperations = useMemo(() => {
		const minRows = 6;
		const emptyRowsCount = Math.max(0, minRows - filteredOperations.length);

		// Preenche com linhas vazias se necessário
		const emptyRows = Array.from({ length: emptyRowsCount }, () => ({
			id: "",
			name: "",
			scheduled_date: "",
			scheduled_time: "",
			user_tag: "",
			status: "",
			deleted: false,
		}));

		return [...filteredOperations, ...emptyRows];
	}, [filteredOperations]);

	// ------------------------------
	// Determina altura máxima da tabela para scroll
	// ------------------------------
	const maxTableHeight = 6 * 48; // 6 linhas * 48px de altura (h-12)

	return (
		<Card className="border border-gray-200" role="region" aria-labelledby="history-title">
			<CardHeader className="flex flex-row justify-between items-start">
				<div>
					<CardTitle id="history-title" className="text-zinc-900 text-2xl font-bold">
						Histórico de Operações
					</CardTitle>
					<p className="text-sm text-zinc-500" id="history-description">
						Registro de operações realizadas
					</p>
				</div>
			</CardHeader>

			<CardContent>
				<div className="border border-gray-200 rounded-lg overflow-hidden">
					<div
						className="overflow-y-auto"
						style={{ maxHeight: `${maxTableHeight}px` }}
					>
						<Table aria-label="Histórico de operações">
							<TableHeader>
								<TableRow className="bg-gray-100">
									<TableHead className="text-zinc-500 font-medium">Nome</TableHead>
									<TableHead className="text-zinc-500 font-medium">Data</TableHead>
									<TableHead className="text-zinc-500 font-medium">Hora</TableHead>
									<TableHead className="text-zinc-500 font-medium">Usuário</TableHead>
									<TableHead className="text-zinc-500 font-medium">Status</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{paddedOperations.map((op, idx) => (
									<TableRow key={idx} className="hover:bg-gray-50 h-12">
										<TableCell className="text-zinc-900">{op.name}</TableCell>
										<TableCell className="text-zinc-900">{formatDate(op.scheduled_date)}</TableCell>
										<TableCell className="text-zinc-900">{op.scheduled_time}</TableCell>
										<TableCell className="text-zinc-900">{op.user_tag}</TableCell>
										<TableCell>
											{op.deleted ? (
												<span className="px-3 py-1 rounded-full text-xs bg-red-500 text-white">
													Excluída
												</span>
											) : op.status === "Concluído" || op.status === "success" ? (
												<span className="px-3 py-1 rounded-full text-xs bg-green-600 text-white">
													Concluído
												</span>
											) : (
												<span className="text-xs">&nbsp;</span>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
