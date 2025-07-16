import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewOpForm() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Agendar nova operação</CardTitle>
				<p className="text-sm text-muted-foreground">
					Preencha os campos para agendar uma nova operação de scraping
				</p>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Input type="date" />
					<Input type="time" />
					<Input placeholder="Nome da operação" />
				</div>
				<Button className="mt-4">Agendar</Button>
			</CardContent>
		</Card>
	);
}
