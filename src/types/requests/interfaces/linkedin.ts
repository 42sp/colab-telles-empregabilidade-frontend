import type { MetricCardProps } from "@/components/dashboard/MetricCard";
import type { SectorDistributionProps } from "@/components/dashboard/SectorDistributionChart";
import type { SyncStatusData } from "@/components/dashboard/SyncStatusTable";

export interface EmploymentByMonthProps {
	month: string;
	trabalhando: number;
	sem_trabalho: number;
}

export interface GetLinkedinDashboardResponse {
	metrics: MetricCardProps[];
	employmentByMonth: EmploymentByMonthProps[];
	sectorDistribution: SectorDistributionProps[];
	statusSync: SyncStatusData;
}
