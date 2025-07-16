import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function OpHistory() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Histórico de Operações</CardTitle>
				<p className="text-sm text-muted-foreground">
					Registro de operações realizadas
				</p>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>Data</TableHead>
							<TableHead>Hora</TableHead>
							<TableHead>Usuário</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Coleta LinkedIn RH</TableCell>
							<TableCell>10/06/2023</TableCell>
							<TableCell>08:30</TableCell>
							<TableCell>recruiter_rh</TableCell>
							<TableCell>
								<span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
									Concluído
								</span>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
