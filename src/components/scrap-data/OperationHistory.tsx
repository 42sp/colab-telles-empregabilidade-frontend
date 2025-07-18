import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function OperationHistory() {
	return (
		<Card
			className="border border-gray-200"
			role="region"
			aria-labelledby="history-title"
		>
			<CardHeader className="flex flex-row justify-between items-start">
				<div>
					<CardTitle
						id="history-title"
						className="text-zinc-900 text-2xl font-bold"
					>
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
								<TableHead className="text-zinc-500 font-medium">
									Nome
								</TableHead>
								<TableHead className="text-zinc-500 font-medium">
									Data
								</TableHead>
								<TableHead className="text-zinc-500 font-medium">
									Hora
								</TableHead>
								<TableHead className="text-zinc-500 font-medium">
									Usuário
								</TableHead>
								<TableHead className="text-zinc-500 font-medium">
									Status
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[
								[
									"Coleta LinkedIn RH",
									"10/06/2023",
									"08:30",
									"recrutador_rh",
									"success",
								],
								[
									"Coleta Perfis Tech",
									"11/06/2023",
									"10:00",
									"tech_recruiter",
									"success",
								],
								[
									"Coleta Desenvolvedores",
									"12/06/2023",
									"14:15",
									"dev_hunter",
									"error",
								],
								[
									"Coleta Gerentes",
									"13/06/2023",
									"09:45",
									"manager_search",
									"success",
								],
								["Coleta Marketing", "", "", "", ""],
							].map(([nome, data, hora, usuario, status], idx) => (
								<TableRow key={idx} className="hover:bg-gray-50 h-12 ">
									<TableCell className="text-zinc-900 max-w-[380px] overflow-auto">
										{nome}
									</TableCell>
									<TableCell className="text-zinc-900 max-w-[380px] overflow-auto">
										{data}
									</TableCell>
									<TableCell className="text-zinc-900 max-w-[380px] overflow-auto">
										{hora}
									</TableCell>
									<TableCell className="text-zinc-900 max-w-[380px] overflow-auto">
										{usuario}
									</TableCell>
									<TableCell>
										{status === "success" && (
											<span className="px-3 py-1 rounded-full text-xs bg-zinc-900 text-white">
												Concluído
											</span>
										)}
										{status === "error" && (
											<span className="px-3 py-1 rounded-full text-xs bg-red-400 text-white">
												Falha
											</span>
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
