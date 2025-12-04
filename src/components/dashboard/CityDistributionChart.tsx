import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPinned } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { memo } from "react";
import { LazyLoadWrapper } from "./LazyLoadWrapper";
import { Skeleton } from "../ui/skeleton";

export interface CityDistributionProps {
	name: string;
	value: number;
}

const COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#14b8a6"];

const CityDistributionChart = ({
	data,
}: {
	data: CityDistributionProps[];
}) => {
	// Limitar a 10 cidades com mais alunos
	const topCities = data.slice(0, 10);

	return (
		<Card className="bg-white">
			<CardHeader className="pb-0">
				<div className="space-y-1">
					<CardTitle className="text-base font-medium flex items-center gap-2">
						<MapPinned className="h-5 w-5" />
						Distribuição por Cidade
					</CardTitle>
					<p className="text-sm text-gray-500">
						Top 10 cidades onde os alunos estão localizados
					</p>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="h-[300px] w-full m-auto">
					<LazyLoadWrapper
						className="h-full flex items-center justify-center"
						loadingComponent={
							<div className="w-10 h-10 border-4 border-t-4 border-black border-t-white rounded-full animate-spin" />
						}
					>
						{topCities.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={topCities}
									margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="name"
										angle={-45}
										textAnchor="end"
										height={100}
										interval={0}
										style={{ fontSize: "12px" }}
									/>
									<YAxis />
									<Tooltip />
									<Bar dataKey="value" name="Alunos">
										{topCities.map((_, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<Skeleton className="h-[250px] w-full" />
						)}
					</LazyLoadWrapper>
				</div>
			</CardContent>
		</Card>
	);
};

export default memo(CityDistributionChart);
