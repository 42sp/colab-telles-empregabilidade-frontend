import { useEffect, useState } from "react";
import { scrapService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DeleteButton } from "./DeleteButton";


type Operation = {
	_id: string;
	name: string;
	scheduled_date: string;
	scheduled_time: string;
	user_tag: string;
};

function formatDate(dateStr: string) {
	if (!dateStr) return "";
	const [year, month, day] = dateStr.split("-");
	return `${day}/${month}/${year}`;
}

function isFutureOrToday(dateStr: string) {
	if (!dateStr) return false;
	const today = new Date();
	const date = new Date(dateStr);
	return date >= new Date(today.toDateString());
}

export function ActiveBooking() {
	const [operations, setOperations] = useState<Operation[]>([]);

	useEffect(() => {
		async function fetchActiveOperations() {
			try {
				const response = await scrapService.find({
					query: {
						$sort: { scheduled_date: 1 },
					},
				});
				const raw = response.data || [];
				const futureOps = raw.filter((op: Operation) => isFutureOrToday(op.scheduled_date));
				setOperations(futureOps);
			} catch (err) {
				console.error("Erro ao buscar agendamentos ativos:", err);
			}
		}

		fetchActiveOperations();
	}, []);

	function handleDeleted(id: string) {
		setOperations(prev => prev.filter(op => op._id !== id));
	}

	return (
		<Card className="border border-gray-200" role="region" aria-labelledby="active-bookings-title">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle id="active-bookings-title" className="text-zinc-900 text-2xl font-bold">
						Agendamentos Ativos
					</CardTitle>
					<p className="text-sm text-zinc-500 font-normal" id="active-bookings-description">
						Lista de operações agendadas
					</p>
				</div>
				<span className="bg-zinc-100 text-zinc-900 px-2 py-1 rounded-md text-sm font-bold">
					{operations.length}
				</span>
			</CardHeader>

			<CardContent>
				<div className="border border-gray-200 rounded-lg overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-100">
								<TableHead className="text-zinc-500 font-medium">Nome</TableHead>
								<TableHead className="text-zinc-500 font-medium">Data</TableHead>
								<TableHead className="text-zinc-500 font-medium">Hora</TableHead>
								<TableHead className="text-zinc-500 font-medium">Usuário</TableHead>
								<TableHead className="text-zinc-500 font-medium">Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{operations.map((op, index) => (
								<TableRow key={index} className="hover:bg-gray-50">
									<TableCell className="text-zinc-900">{op.name}</TableCell>
									<TableCell className="text-zinc-900">{formatDate(op.scheduled_date)}</TableCell>
									<TableCell className="text-zinc-900">{op.scheduled_time}</TableCell>
									<TableCell className="text-zinc-900">{op.user_tag}</TableCell>
									<TableCell>
										<TooltipProvider delayDuration={500}>
											<Tooltip>
												<TooltipTrigger asChild>
													<DeleteButton 
														id={op._id}
														name={op.name}
														onDeleted={() =>
															setOperations((prev) => prev.filter((o) => o._id !== op._id))
														}
												/>
												</TooltipTrigger>
												<TooltipContent>
													<p>Excluir</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</TableCell>
								</TableRow>
							))}
							{operations.length === 0 && (
								<TableRow key="empty">
									<TableCell colSpan={5} className="text-center text-zinc-500 py-4">
										Nenhum agendamento ativo
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
