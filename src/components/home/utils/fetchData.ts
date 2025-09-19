import { useCallback } from "react";
import type { StudentsParameters } from "@/types/requests";
import type { StudentsQuery } from "@/pages/home/types";
import { useServices } from "@/hooks/useServices";

export function useFetchData(
	buildQuery: (skipIndex: number) => StudentsQuery,
	setDataRows: (rows: StudentsParameters[]) => void
) {
	const $service = useServices();
	return useCallback(
		async (skipIndex: number) => {
			try {
				const query = buildQuery(skipIndex);
				const response = await $service.students(query);
				setDataRows(response.data.data);
			} catch (error) {
				console.error("Failed to fetch students:", error);
			}
		},
		[$service, buildQuery, setDataRows]
	);
}
