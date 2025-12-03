import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	RefreshCcw,
	Users,
	Briefcase,
	UserX,
	Building2,
	DollarSign,
} from "lucide-react";
import {
	MetricCard,
	type MetricCardProps,
} from "@/components/dashboard/MetricCard";
import {
	SyncStatusTable,
	type SyncStatusData,
} from "@/components/dashboard/SyncStatusTable";
import { lazy, useEffect, useState } from "react";
import { FadeInOnScroll } from "@/components/utils/FadeInOnScroll";
import { useSidebar } from "@/contexts/SidebarContext";
import { useServices } from "@/hooks/useServices";
import type { EmploymentByMonthProps } from "@/types/requests";
import type { SectorDistributionProps } from "@/components/dashboard/SectorDistributionChart";

// Lazy charts
const EmploymentStatusChart = lazy(
	() => import("@/components/dashboard/EmploymentStatusChart")
);
const SectorDistributionChart = lazy(
	() => import("@/components/dashboard/SectorDistributionChart")
);
const OrganizationDistributionChart = lazy(
	() => import("@/components/dashboard/OrganizationDistributionChart")
);
const SalaryDistributionChart = lazy(
	() => import("@/components/dashboard/SalaryDistributionChart")
);

const icons = {
	refreshIcon: <RefreshCcw className="h-5 w-5" />,
	usersIcon: <Users className="h-5 w-5" />,
	briefcaseIcon: <Briefcase className="h-5 w-5" />,
	userXIcon: <UserX className="h-5 w-5" />,
	buildingIcon: <Building2 className="h-5 w-5" />,
	dollarIcon: <DollarSign className="h-5 w-5" />,
};

export function Dashboard() {
	const [getMetrics, setGetMetrics] = useState<MetricCardProps[]>([
		{} as MetricCardProps,
		{} as MetricCardProps,
		{} as MetricCardProps,
	]);
	const [getEmploymentByMonth, setGetEmploymentByMonth] = useState<
		EmploymentByMonthProps[]
	>([]);
	const [getSectorDistribution, setSectorDistribution] = useState<
		SectorDistributionProps[]
	>([]);
	const [getOrganizationDistribution, setOrganizationDistribution] = useState<
		SectorDistributionProps[]
	>([]);
	const [getStatusSync, setStatusSync] = useState<SyncStatusData | undefined>(
		undefined
	);

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		const observer = new MutationObserver(() => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				window.dispatchEvent(new Event("resize"));
			}, 300);
		});

		const sidebar = document.querySelector(".sidebar");
		if (sidebar) {
			observer.observe(sidebar, {
				attributes: true,
				attributeFilter: ["class"],
			});
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			window.dispatchEvent(new Event("resize"));
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	const { animationsEnabled } = useSidebar();

	const $service = useServices();

	useEffect(() => {
		async function fetchLinkedinDashboard() {
			const linkedinDashboard = await $service.getLinkedinDashboard();
			setGetMetrics(
				linkedinDashboard.metrics.map(item => {
					const mapped = { ...item, icon: <></> };

					if (item.title === "Total de Alunos") mapped.icon = icons.usersIcon;
					else if (item.title === "Alunos Trabalhando")
						mapped.icon = icons.briefcaseIcon;
					else if (item.title === "Alunos sem Trabalho")
						mapped.icon = icons.userXIcon;
					else if (item.title === "Empresas Pesquisadas")
						mapped.icon = icons.buildingIcon;
					else if (item.title === "Salário Médio (R$)")
						mapped.icon = icons.dollarIcon;

					return mapped;
				})
			);
			setGetEmploymentByMonth(linkedinDashboard.employmentByMonth);
			setSectorDistribution(linkedinDashboard.sectorDistribution);
			setOrganizationDistribution(linkedinDashboard.organizationDistribution);
			setStatusSync(linkedinDashboard.statusSync);
		}
		fetchLinkedinDashboard();
	}, []);

	return (
		<div className="bg-slate-50 contain-layout">
			<div className="container mx-auto p-6 space-y-8">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
					<p className="text-md text-gray-600">
						Visão geral dos dados de empregabilidade dos alunos
					</p>
				</div>

				{/* Métricas */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 lg:gap-6 mb-10">
					{
						// [
						// 	{
						// 		title: "Sincronia de Dados",
						// 		value: "98%",
						// 		description: "Última atualização: 15 min",
						// 		icon: icons.refreshIcon,
						// 	},
						// 	{
						// 		title: "Total de Alunos",
						// 		value: "1.248",
						// 		description: "Desde o último mês",
						// 		trend: 12,
						// 		icon: icons.usersIcon,
						// 	},
						// 	{
						// 		title: "Alunos Trabalhando",
						// 		value: "876",
						// 		description: "70,2% do total de alunos",
						// 		icon: icons.briefcaseIcon,
						// 	},
						// 	{
						// 		title: "Alunos sem Trabalho",
						// 		value: "372",
						// 		description: "29,8% do total de alunos",
						// 		icon: icons.userXIcon,
						// 	},
						// 	{
						// 		title: "Empresas Pesquisadas",
						// 		value: "342",
						// 		description: "Desde o último mês",
						// 		trend: 8,
						// 		icon: icons.buildingIcon,
						// 	},
						// 	{
						// 		title: "Salário Médio (R$)",
						// 		value: "3.850",
						// 		description: "Desde o último mês",
						// 		trend: 5,
						// 		icon: icons.dollarIcon,
						// 	},
						// ]
						getMetrics.map((metric, index) => (
							<FadeInOnScroll
								key={index}
								delay={index * 0.1}
								enabled={animationsEnabled}
							>
								<MetricCard {...metric} />
							</FadeInOnScroll>
						))
					}
				</div>

				{/* Charts */}
				<div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-10 mb-10">
					{getEmploymentByMonth.length > 0 && (
						<FadeInOnScroll enabled={animationsEnabled}>
							<EmploymentStatusChart data={getEmploymentByMonth} />
						</FadeInOnScroll>
					)}

					{getSectorDistribution.length > 0 && (
						<FadeInOnScroll delay={0.1} enabled={animationsEnabled}>
							<SectorDistributionChart data={getSectorDistribution} />
						</FadeInOnScroll>
					)}

					{getOrganizationDistribution.length > 0 && (
						<FadeInOnScroll
							className="lg:col-span-2"
							delay={0.2}
							enabled={animationsEnabled}
						>
							<OrganizationDistributionChart data={getOrganizationDistribution} />
						</FadeInOnScroll>
					)}

					<FadeInOnScroll
						className="lg:col-span-2"
						delay={0.3}
						enabled={animationsEnabled}
					>
						<SalaryDistributionChart />
					</FadeInOnScroll>
				</div>

				{/* Tabela de Status */}
				{getStatusSync && getStatusSync.processingTime && (
					<FadeInOnScroll
						className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-10 mb-10"
						delay={0.3}
						enabled={animationsEnabled}
					>
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
								<SyncStatusTable data={getStatusSync} />
							</CardContent>
						</Card>
					</FadeInOnScroll>
				)}
			</div>
		</div>
	);
}

export default Dashboard;
