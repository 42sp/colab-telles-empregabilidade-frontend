import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	RefreshCcw,
	Users,
	Briefcase,
	UserX,
	Building2,
	DollarSign,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SyncStatusTable } from "@/components/dashboard/SyncStatusTable";
import { SalaryDistributionChart } from "@/components/dashboard/SalaryDistributionChart";
import { dashboardData } from "@/data/dashboard";
import { EmploymentStatusChart } from "@/components/dashboard/EmploymentStatusChart";
import { SectorDistributionChart } from "@/components/dashboard/SectorDistributionChart";
import { useMemo } from "react";

const memoizedIcons = {
	refreshIcon: <RefreshCcw className="h-5 w-5" />,
	usersIcon: <Users className="h-5 w-5" />,
	briefcaseIcon: <Briefcase className="h-5 w-5" />,
	userXIcon: <UserX className="h-5 w-5" />,
	buildingIcon: <Building2 className="h-5 w-5" />,
	dollarIcon: <DollarSign className="h-5 w-5" />,
};

export function Dashboard() {
	const metricsSection = useMemo(
		() => (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 lg:gap-10 mb-10">
				{/* Card 1: Sincronia de Dados */}
				<MetricCard
					title="Sincronia de Dados"
					value="98%"
					description="Última atualização: 15 min atrás"
					icon={memoizedIcons.refreshIcon}
				/>
				{/* Card 2: Total de Alunos */}
				<MetricCard
					title="Total de Alunos"
					value="1.248"
					description="Desde o último mês"
					trend={12}
					icon={memoizedIcons.usersIcon}
				/>
				{/* Card 3: Alunos Trabalhando */}
				<MetricCard
					title="Alunos Trabalhando"
					value="876"
					description="70,2% do total de alunos"
					icon={memoizedIcons.briefcaseIcon}
				/>
				{/* Card 4: Alunos sem Trabalho */}
				<MetricCard
					title="Alunos sem Trabalho"
					value="372"
					description="29,8% do total de alunos"
					icon={memoizedIcons.userXIcon}
				/>

				{/* Card 5: Empresas Pesquisadas */}
				<MetricCard
					title="Empresas Pesquisadas"
					value="342"
					description="Desde o último mês"
					trend={8}
					icon={memoizedIcons.buildingIcon}
				/>

				{/* Card 6: Salário Médio */}
				<MetricCard
					title="Salário Médio"
					value="R$ 3.850"
					description="desde o último mês"
					trend={5}
					icon={memoizedIcons.dollarIcon}
				/>
			</div>
		),
		[]
	);

	const chartsSection = useMemo(
		() => (
			<div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-10 mb-10">
				<EmploymentStatusChart />
				<SectorDistributionChart />
				<SalaryDistributionChart className="lg:col-span-2" />
			</div>
		),
		[]
	);

	return (
		<div className="bg-slate-50 min-h-screen">
			<div className="container mx-auto p-6 space-y-8 ">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
					<p className="text-md text-gray-600">
						Visão geral dos dados de empregabilidade dos alunos
					</p>
				</div>

				{metricsSection}

				{chartsSection}

				{/* Card 7: Status de Sincronia de Dados */}
				<div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-10 mb-10">
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
		</div>
	);
}

export default Dashboard;
