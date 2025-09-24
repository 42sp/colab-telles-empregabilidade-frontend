import { useCallback } from "react";
import type { FilterType, Stats, StudentsQuery } from "@/pages/home/types";
import { useServices } from "@/hooks/useServices";

export function useFetchStats(
	buildQuery: (skipIndex: number) => StudentsQuery,
	setStats: (s: Stats) => void,
) {
	const $service = useServices();
	return useCallback(async () => {
		try {
			const query = buildQuery(0);
			const response = await $service.studentsStats(query);

			setStats({
				total: response.data.total,
				working: response.data.working,
				notWorking: response.data.notWorking,
				avgCompensation: Number(response.data.avgCompensation),
			});
		} catch (error) {
			console.error("Failed to fetch students:", error);
		}
	}, [$service, buildQuery, setStats]);
}

// import type { Stats, StudentsQuery } from "@/pages/home/types";
// import { useServices } from "@/hooks/useServices";

// export function useFetchStats(
// 	buildQuery: (skipIndex: number) => StudentsQuery,
// 	setStats: (s: Stats) => void
// ) {
// 	const $service = useServices();

// 	const fetchStats = async () => {
// 		try {
// 			const query = buildQuery(0);
// 			const response = await $service.studentsStats(query);

// 			setStats({
// 				total: response.data.total,
// 				working: response.data.working,
// 				notWorking: response.data.notWorking,
// 				avgCompensation: Number(response.data.avgCompensation),
// 			});
// 		} catch (error) {
// 			console.error("Failed to fetch students:", error);
// 		}
// 	};

// 	return fetchStats;
// }
