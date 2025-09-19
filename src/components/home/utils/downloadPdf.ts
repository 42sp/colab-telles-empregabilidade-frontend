import { useServices } from "@/hooks/useServices";
import type { ColumnVisibility, Data, StudentsQuery } from "@/pages/home/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function downloadPdf(
	query: StudentsQuery,
	exportName: string,
	columns: ColumnVisibility,
	$service: ReturnType<typeof useServices>
) {
	const rows: Data[] = [];
	const limitPerRequest = 50;
	let skip = 0;
	let total = 0;

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

	const visibleKey = Object.keys(columns).filter(
		key => columns[key as keyof typeof columns].isVisible
	);
	const format: string =
		visibleKey.length <= 25
			? "a4"
			: visibleKey.length <= 50
				? "a3"
				: visibleKey.length <= 75
					? "a2"
					: "a1";

	const doc = new jsPDF({
		orientation: "landscape",
		unit: "mm",
		format: format,
	});

	const headers = visibleKey.map(
		key => columns[key as keyof typeof columns].label
	);

	const data = rows.map(row =>
		visibleKey.map(key => {
			const typedKey = key as keyof Data;

			if (key === "compensation") {
				const value = row[typedKey];
				const num: number = Number(value);
				const zeroValue = new Intl.NumberFormat("pt-BR", {
					style: "currency",
					currency: "BRL",
				}).format(0);
				const formattedValue = new Intl.NumberFormat("pt-BR", {
					style: "currency",
					currency: "BRL",
				}).format(num);

				if (value === null || value === undefined || isNaN(num))
					return zeroValue;
				return formattedValue;
			}

			if (row[typedKey] !== null) {
				const input = row[typedKey];
				let value: string = String(input).trim();
				if (typeof input === "boolean") value = input ? "Sim" : "Não";
				return value === "" ? "-" : value;
			}

			return "-";
		})
	);

	autoTable(doc, {
		head: [headers],
		body: data,
		startY: 10,
		margin: { left: 5, right: 5 },
		styles: {
			fontSize: 5,
			cellPadding: 0.5,
			overflow: "linebreak",
			halign: "center",
		},
		headStyles: {
			fontSize: 6,
			fontStyle: "bold",
			fillColor: [200, 200, 200],
			halign: "center",
		},
		tableWidth: "auto",
		theme: "grid",
		showHead: "everyPage",
		pageBreak: "auto",
		rowPageBreak: "avoid",
	});

	doc.save(exportName + ".pdf");
}
