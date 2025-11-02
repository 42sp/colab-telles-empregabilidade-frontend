import type { useServices } from "@/hooks/useServices";
import type { ColumnVisibility, Data, StudentsQuery } from "@/pages/home/types";

export async function downloadCsv(
	query: StudentsQuery,
	exportName: string,
	columns: ColumnVisibility,
	$service: ReturnType<typeof useServices>
) {
	const rows: Data[] = [];
	const limitPerRequest: number = 50;
	let skip: number = 0;
	let total: number = 0;

	do {
		const partialQuery: StudentsQuery = {
			...query,
			$limit: limitPerRequest,
			$skip: skip,
		};

		const response = await $service.students(partialQuery);
		const data: Data[] = response.data.data;
		total = response.data.total;

		rows.push(...data);
		skip += limitPerRequest;
	} while (rows.length < total);

	// Monta CSV
	const visibleKey = Object.keys(columns).filter(
		key => columns[key as keyof typeof columns].isVisible
	);
	const header = visibleKey
		.map(key => columns[key as keyof typeof columns].label || key)
		.join(",");

	const body = rows
		.map(row =>
			visibleKey
				.map(key => {
					const typedKey = key as keyof Data;
					const value = row[typedKey];
					const str =
						value !== null && value !== undefined ? String(value).trim() : "";

					if (key === "compensation") {
						const num: number = Number(value);
						return isNaN(num) ? "0.00" : num.toFixed(2);
					}

					if (str.includes(",") || str.includes('"') || str.includes("'")) {
						return `"${str}"`;
					}

					return str === "" ? `""` : str;
				})
				.join(",")
		)
		.join("\n");

	const csvContent = `${header}\n${body}`;
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", exportName + ".csv");
	link.click();
}
