import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartSpline } from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { memo } from "react";
import { LazyLoadWrapper } from "./LazyLoadWrapper";

const data = [
	{ range: "Até R$2.000", alunos: 120 },
	{ range: "R$2.001-R$3.000", alunos: 280 },
	{ range: "R$3.001-R$4.000", alunos: 320 },
	{ range: "R$4.001-R$5.000", alunos: 220 },
	{ range: "R$5.001-R$6.000", alunos: 150 },
	{ range: "Acima de R$6.000", alunos: 90 },
];

interface SalaryDistributionChartProps {
	className?: string;
}

function SalaryDistributionChart({ className }: SalaryDistributionChartProps) {
	return (
		<Card className={`bg-white ${className ?? ""}`}>
			<CardHeader className="pb-0">
				<div className="space-y-1">
					<CardTitle className="text-base font-medium flex items-center gap-2">
						<ChartSpline className="h-5 w-5" />
						Distribuição por Faixa Salarial
					</CardTitle>
					<p className="text-sm text-gray-500">
						Quantidade de alunos por faixa salarial
					</p>
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-[1123px] 2xl:w-[1385px] m-auto">
					<LazyLoadWrapper
						className="h-full flex items-center justify-center"
						loadingComponent={
							<div className="w-10 h-10 border-4 border-t-4 border-black border-t-white rounded-full animate-spin" />
						}
					>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={data}
								margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
								<XAxis
									dataKey="range"
									angle={-45}
									textAnchor="end"
									height={60}
									tick={{ fontSize: 12 }}
								/>
								<YAxis
									tick={{ fontSize: 12 }}
									label={{
										value: "Quantidade de Alunos",
										angle: -90,
										position: "insideLeft",
										style: { textAnchor: "middle" },
									}}
								/>
								<Tooltip />
								<Line
									type="monotone"
									dataKey="alunos"
									stroke="#0ea5e9"
									strokeWidth={2}
									dot={{ r: 4, fill: "#0ea5e9" }}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</LazyLoadWrapper>
				</div>
			</CardContent>
		</Card>
	);
}

export default memo(SalaryDistributionChart);
