export interface SyncStatus {
	percentage: number;
	lastUpdated: string;
	lastSync: string;
	status: string;
	processedRecords: number;
	processingTime: string;
	nextSync: string;
}

export interface Metrics {
	totalStudents: number;
	studentIncrease: number;
	employedStudents: number;
	employedPercentage: number;
	unemployedStudents: number;
	unemployedPercentage: number;
	researchedCompanies: number;
	companiesIncrease: number;
	averageSalary: number;
	salaryIncrease: number;
}

export interface DashboardData {
	syncStatus: SyncStatus;
	metrics: Metrics;
}

export const dashboardData: DashboardData = {
	syncStatus: {
		percentage: 98,
		lastUpdated: "15 min atrás",
		lastSync: "Hoje, 10:45",
		status: "Sincronizado",
		processedRecords: 1248,
		processingTime: "45 segundos",
		nextSync: "Hoje, 16:45",
	},
	metrics: {
		totalStudents: 1248,
		studentIncrease: 12,
		employedStudents: 876,
		employedPercentage: 70.2,
		unemployedStudents: 372,
		unemployedPercentage: 29.8,
		researchedCompanies: 342,
		companiesIncrease: 8,
		averageSalary: 3850,
		salaryIncrease: 5,
	},
};
