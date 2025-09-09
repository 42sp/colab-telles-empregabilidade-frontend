import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartColumn } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { memo } from "react";
import { LazyLoadWrapper } from "./LazyLoadWrapper";

const data = [
	{ month: "Jan", Trabalhando: 650, "Sem Trabalho": 300 },
	{ month: "Fev", Trabalhando: 680, "Sem Trabalho": 280 },
	{ month: "Mar", Trabalhando: 700, "Sem Trabalho": 270 },
	{ month: "Abr", Trabalhando: 720, "Sem Trabalho": 260 },
	{ month: "Mai", Trabalhando: 750, "Sem Trabalho": 250 },
	{ month: "Jun", Trabalhando: 780, "Sem Trabalho": 240 },
	{ month: "Jul", Trabalhando: 800, "Sem Trabalho": 230 },
	{ month: "Ago", Trabalhando: 820, "Sem Trabalho": 220 },
];

function EmploymentStatusChart() {
	return (
		<Card className="bg-white">
			<CardHeader className="pb-0">
				<div className="space-y-1">
					<CardTitle className="text-base font-medium flex items-center gap-2">
						<ChartColumn className="h-5 w-5" />
						Status de Emprego por Mês
					</CardTitle>
					<p className="text-sm text-gray-500">
						Comparação entre alunos trabalhando e sem trabalho
					</p>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				<div className="h-[300px] w-[550px] m-auto">
					<LazyLoadWrapper
						className="h-full flex items-center justify-center"
						loadingComponent={
							<div className="w-10 h-10 border-4 border-t-4 border-black border-t-white rounded-full animate-spin" />
						}
					>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={data}
								margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="Sem Trabalho" fill="#10b981" />
								<Bar dataKey="Trabalhando" fill="#f97316" />
							</BarChart>
						</ResponsiveContainer>
					</LazyLoadWrapper>
				</div>
			</CardContent>
		</Card>
	);
}

export default memo(EmploymentStatusChart);
