import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function ActiveBooking() {
	return (
		<Card
			className="border border-gray-200"
			role="region"
			aria-labelledby="active-bookings-title"
		>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle
						id="active-bookings-title"
						className="text-zinc-900 text-2xl font-bold"
					>
						Agendamentos Ativos
					</CardTitle>
					<p
						className="text-sm text-zinc-500 font-normal"
						id="active-bookings-description"
					>
						Lista de operações agendadas
					</p>
				</div>
				<span
					className="bg-zinc-100 text-zinc-900 px-2 py-1 rounded-md text-sm font-bold"
					role="status"
					aria-label="Número de agendamentos ativos"
				>
					5
				</span>
			</CardHeader>
			<CardContent>
				<div className="border border-gray-200 rounded-lg overflow-hidden">
					<Table aria-label="Agendamentos ativos">
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
									Ações
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[
								["Coleta LinkedIn RH", "15/06/2023", "08:30", "recrutador_rh"],
								["Coleta Perfis Tech", "16/06/2023", "10:00", "tech_recruiter"],
								["Coleta Desenvolvedores", "17/06/2023", "14:15", "dev_hunter"],
								["Coleta Gerentes", "18/06/2023", "09:45", "manager_search"],
								["Coleta Marketing", "19/06/2023", "16:30", "mkt_recruiter"],
							].map(([nome, data, hora, usuario], idx) => (
								<TableRow key={idx} className="hover:bg-gray-50">
									<TableCell className="text-zinc-900">{nome}</TableCell>
									<TableCell className="text-zinc-900">{data}</TableCell>
									<TableCell className="text-zinc-900">{hora}</TableCell>
									<TableCell className="text-zinc-900">{usuario}</TableCell>
									<TableCell>
										<TooltipProvider delayDuration={500}>
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														className="p-2 rounded-lg bg-red-500 hover:bg-red-500/90 text-white"
														aria-label={`Excluir agendamento ${nome}`}
														onKeyDown={e => {
															if (e.key === "Enter" || e.key === " ") {
																e.preventDefault();
																// Add your delete handler here
															}
														}}
													>
														<Trash2 className="h-4 w-4" aria-hidden="true" />
													</button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Excluir</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
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
