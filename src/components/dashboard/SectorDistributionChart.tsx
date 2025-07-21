import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartPie } from "lucide-react";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from "recharts";

const data = [
	{ name: "Tecnologia", value: 42 },
	{ name: "Marketing", value: 18 },
	{ name: "Finanças", value: 15 },
	{ name: "Educação", value: 12 },
	{ name: "Saúde", value: 8 },
];

const COLORS = ["#f97316", "#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6"];

export function SectorDistributionChart() {
	return (
		<Card className="bg-white">
			<CardHeader className="pb-0">
				<div className="space-y-1">
					<CardTitle className="text-base font-medium flex items-center gap-2">
						<ChartPie className="h-5 w-5" />
						Distribuição por Setor
					</CardTitle>
					<p className="text-sm text-gray-500">
						Porcentagem de alunos por setor de atuação
					</p>
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								labelLine={true}
								label={({ name, percent }) =>
									`${name}: ${(percent * 100).toFixed(0)}%`
								}
								outerRadius={100}
								fill="#8884d8"
								dataKey="value"
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
