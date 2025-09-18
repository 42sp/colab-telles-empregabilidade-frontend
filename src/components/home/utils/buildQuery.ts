import {
	booleanFields,
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

			const translate = (value: string) => {
				const lower = value.trim().toLowerCase();
				if (lower === "sim") return true;
				else if (["não", "nao"].includes(lower)) return false;
				return value;
			};
			for (const key of Object.keys(filter)) {
				const value: string = filter[key]?.trim() ?? "";
				if (!value) continue;

				const translated: string | boolean = translate(value);
				if (booleanFields.has(key)) {
					if (typeof translated === "boolean") q[key] = translated;
				} else if (value) q[key] = { $ilike: `${translated}%` };
			}

			return q;
		},
		[activeLabel, filter]
	);

	return buildQuery;
}
