import {
	booleanFields,
	numberFields,
	type FilterType,
	type StudentsQuery,
} from "@/pages/home/types";
import { useCallback } from "react";

export function useBuildQuery(activeLabel: string, filter: FilterType) {
	const rowsPerPage = 10;

	const buildQuery = useCallback(
		(skipIndex: number): StudentsQuery => {
			const q: StudentsQuery = {
				$limit: rowsPerPage,
				$skip: skipIndex,
			};
			if (activeLabel === "Formados") {
				q.realStatus = { $ilike: `formad%` };
			} else if (activeLabel !== "Todos") {
				q.holderContractStatus = {
					$ilike: activeLabel === "Ativos" ? "Ativ%" : "Inativ%",
				};
			}

			// const translate = (value: string) => {
			// 	const lower = value.trim().toLowerCase();
			// 	if (lower === "sim") return true;
			// 	else if (["não", "nao"].includes(lower)) return false;
			// 	return value;
			// };
			for (const key of Object.keys(filter)) {
				const rawValue: string = filter[key]?.trim() ?? "";
				if (!rawValue) continue;

				if (booleanFields.has(key)) {
					const lower = rawValue.toLowerCase();
					if (lower === "sim") q[key] = true;
					else if (["não", "nao"].includes(lower)) q[key] = false;
				} else if (numberFields.has(key)) {
					const num = Number(rawValue);
					if (!isNaN(num)) q[key] = { $eq: num };
				} else q[key] = { $ilike: `${rawValue}%` };
			}

			return q;
		},
		[activeLabel, filter]
	);

	return buildQuery;
}
