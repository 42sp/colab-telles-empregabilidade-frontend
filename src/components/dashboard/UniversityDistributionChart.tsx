import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
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

export interface UniversityDistributionProps {
	name: string;
	value: number;
}

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#c026d3", "#d946ef", "#e879f9", "#f0abfc"];

const UniversityDistributionChart = ({
	data,
}: {
	data: UniversityDistributionProps[];
}) => {
	// Limitar a 10 universidades com mais alunos
	const topUniversities = data.slice(0, 10);

	return (
		<Card className="bg-white">
			<CardHeader className="pb-0">
				<div className="space-y-1">
					<CardTitle className="text-base font-medium flex items-center gap-2">
						<GraduationCap className="h-5 w-5" />
						Universidades com Mais Alunos
					</CardTitle>
					<p className="text-sm text-gray-500">
						Top 10 universidades mais acessadas pelos alunos
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
						{topUniversities.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={topUniversities}
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
										{topUniversities.map((_, index) => (
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

export default memo(UniversityDistributionChart);
