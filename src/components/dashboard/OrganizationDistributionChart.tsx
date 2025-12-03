import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
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

export interface OrganizationDistributionProps {
	name: string;
	value: number;
}

const COLORS = ["#f97316", "#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

const OrganizationDistributionChart = ({
	data,
}: {
	data: OrganizationDistributionProps[];
}) => {
	// Limitar a 10 empresas com mais alunos
	const topOrganizations = data.slice(0, 10);

	return (
		<Card className="bg-white">
			<CardHeader className="pb-0">
				<div className="space-y-1">
					<CardTitle className="text-base font-medium flex items-center gap-2">
						<Building2 className="h-5 w-5" />
						Empresas com Mais Alunos
					</CardTitle>
					<p className="text-sm text-gray-500">
						Top 10 empresas onde os alunos estão trabalhando
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
						{topOrganizations.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={topOrganizations}
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
										{topOrganizations.map((_, index) => (
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

export default memo(OrganizationDistributionChart);
