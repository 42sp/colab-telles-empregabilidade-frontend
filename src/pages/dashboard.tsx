import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	RefreshCcw,
	Users,
	Briefcase,
	UserX,
	Building2,
	DollarSign,
	CheckCircle2,
	PieChart,
	BarChart2,
	LineChart,
	ChartColumn,
	ChartPie,
	ChartSpline,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SyncStatusTable } from "@/components/dashboard/SyncStatusTable";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { dashboardData } from "@/data/dashboard";
import { EmploymentStatusChart } from "@/components/dashboard/EmploymentStatusChart";
import { SectorDistributionChart } from "@/components/dashboard/SectorDistributionChart";

export function Dashboard() {
	return (
		<div className="p-6 space-y-6 bg-slate-50 min-h-screen">
			<div className="space-y-1">
				<h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
				<p className="text-md text-gray-600">
					Visão geral dos dados de empregabilidade dos alunos
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 lg:gap-10 mb-10">
				{/* Card 1: Sincronia de Dados */}
				<MetricCard
					title="Sincronia de Dados"
					value="98%"
					description="Última atualização: 15 min atrás"
					icon={<RefreshCcw className="h-5 w-5" />}
				/>
				{/* Card 2: Total de Alunos */}
				<MetricCard
					title="Total de Alunos"
					value="1.248"
					description="Desde o último mês"
					trend={12}
					icon={<Users className="h-5 w-5" />}
				/>
				{/* Card 3: Alunos Trabalhando */}
				<MetricCard
					title="Alunos Trabalhando"
					value="876"
					description="70,2% do total de alunos"
					icon={<Briefcase className="h-5 w-5" />}
				/>
				{/* Card 4: Alunos sem Trabalho */}
				<MetricCard
					title="Alunos sem Trabalho"
					value="372"
					description="29,8% do total de alunos"
					icon={<UserX className="h-5 w-5" />}
				/>

				{/* Card 5: Empresas Pesquisadas */}
				<MetricCard
					title="Empresas Pesquisadas"
					value="342"
					description="Desde o último mês"
					trend={8}
					icon={<Building2 className="h-5 w-5" />}
				/>

				{/* Card 6: Salário Médio */}
				<MetricCard
					title="Salário Médio"
					value="R$ 3.850"
					description="desde o último mês"
					trend={5}
					icon={<DollarSign className="h-5 w-5" />}
				/>
			</div>

			<div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-10 mb-10">
				<EmploymentStatusChart />
				<SectorDistributionChart />
			</div>

			<div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-10 mb-10">
				<ChartPlaceholder
					title="Distribuição por Faixa Salarial"
					subtitle="Quantidade de alunos por faixa salarial"
					icon={<ChartSpline className="h-5 w-5" />}
					message="Gráfico de barras mostrando distribuição"
					className="lg:col-span-2"
				/>

				<Card className="lg:col-span-2 p-6">
					<CardHeader className="mb-6">
						<CardTitle className="flex items-center gap-2 text-2xl font-bold">
							Status de Sincronia de Dados
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Informações sobre a última sincronização de dados
						</p>
					</CardHeader>
					<CardContent>
						<SyncStatusTable data={dashboardData.syncStatus} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default Dashboard;
