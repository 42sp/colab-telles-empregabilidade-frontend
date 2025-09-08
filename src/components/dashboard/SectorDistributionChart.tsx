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
import { memo } from "react";
import { LazyLoadWrapper } from "./LazyLoadWrapper";

export interface SectorDistributionProps {
	name: string;
	value: number;
}

const COLORS = ["#f97316", "#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6"];

const renderCustomizedLabel = (props: { name?: string; percent?: number }) => {
	const { name, percent } = props;

	if (percent === undefined || name === undefined) return null;
	return `${name}: ${(percent * 100).toFixed(0)}%`;
};

const SectorDistributionChart = ({
	data,
}: {
	data: SectorDistributionProps[];
}) => {
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
			<CardContent className="p-0">
				<div className="h-[300px] w-[550px] m-auto">
					<LazyLoadWrapper
						className="h-full flex items-center justify-center"
						loadingComponent={
							<div className="w-10 h-10 border-4 border-t-4 border-black border-t-white rounded-full animate-spin" />
						}
					>
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								{data.length > 0 && (
									<Pie
										data={data} // Add percent property
										cx="50%"
										cy="50%"
										labelLine={true}
										label={renderCustomizedLabel}
										outerRadius={100}
										fill="#8884d8"
										dataKey="value"
									>
										{data.map((_, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
								)}
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</LazyLoadWrapper>
				</div>
			</CardContent>
		</Card>
	);
};

export default memo(SectorDistributionChart);
