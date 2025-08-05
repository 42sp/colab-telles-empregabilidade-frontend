import { useEffect, useState } from "react";
import { scrapService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Operation = {
	name: string;
	scheduled_date: string;
	scheduled_time: string;
	user_tag: string;
	status?: "success" | "error";
};

function formatDate(dateStr: string) {
	if (!dateStr) return "";
	const [year, month, day] = dateStr.split("-");
	return `${day}/${month}/${year}`;
}

function isPastDate(dateStr: string) {
	if (!dateStr) return false;
	const today = new Date();
	const date = new Date(dateStr);
	// Considera passado se for antes de hoje
	return date < new Date(today.toDateString());
}

export function OperationHistory() {
	const [operations, setOperations] = useState<Operation[]>([]);

	useEffect(() => {
		async function fetchOperations() {
			try {
				const response = await scrapService.find({
					query: {
						$sort: { scheduled_date: -1 },
					},
				});

				const raw = response.data || [];

				// Filtro de data passada
				const pastOperations = raw.filter((op: Operation) =>
					isPastDate(op.scheduled_date)
				);

				setOperations(pastOperations);
			} catch (err) {
				console.error("Erro ao buscar operações:", err);
			}
		}
		fetchOperations();
	}, []);

	// Garante sempre 4 linhas visuais
	const paddedOperations = [
		...operations,
		...Array.from({ length: Math.max(0, 4 - operations.length) }, () => ({
			name: "",
			scheduled_date: "",
			scheduled_time: "",
			user_tag: "",
			status: "",
		})),
	].slice(0, 4);

	return (
		<Card
			className="border border-gray-200"
			role="region"
			aria-labelledby="history-title"
		>
			<CardHeader className="flex flex-row justify-between items-start">
				<div>
					<CardTitle id="history-title" className="text-zinc-900 text-2xl font-bold">
						Histórico de Operações
					</CardTitle>
					<p className="text-sm text-zinc-500" id="history-description">
						Registro de operações realizadas
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm text-zinc-500">
					<label htmlFor="filter" id="filter-label">
						Filtrar por:
					</label>
					<select
						id="filter"
						className="border border-gray-300 rounded-md px-2 py-1 text-zinc-700 text-sm"
						aria-labelledby="filter-label"
						disabled
					>
						<option value="all">Todos</option>
					</select>
				</div>
			</CardHeader>

			<CardContent>
				<div className="border border-gray-200 rounded-lg overflow-hidden">
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
									<TableCell className="text-zinc-900">
										{formatDate(op.scheduled_date)}
									</TableCell>
									<TableCell className="text-zinc-900">
										{op.scheduled_time}
									</TableCell>
									<TableCell className="text-zinc-900">
										{op.user_tag}
									</TableCell>
									<TableCell>
										{op.status === "success" ? (
											<span className="px-3 py-1 rounded-full text-xs bg-zinc-900 text-white">
												Concluído
											</span>
										) : op.status === "error" ? (
											<span className="px-3 py-1 rounded-full text-xs bg-red-400 text-white">
												Falha
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
			</CardContent>
		</Card>
	);
}
