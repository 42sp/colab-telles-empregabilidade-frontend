import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function ActiveBooking() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Agendamentos Ativos</CardTitle>
				<p className="text-sm text-muted-foreground">
					Lista de operações agendadas
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
							<TableHead>Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Coleta LinkedIn RH</TableCell>
							<TableCell>15/06/2023</TableCell>
							<TableCell>08:30</TableCell>
							<TableCell>recruiter_rh</TableCell>
							<TableCell>
								<Button variant="destructive" size="sm">
									Cancelar
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
