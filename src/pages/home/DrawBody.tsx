import { useEffect, useState } from "react";
import { dataRows, type ColumnKey, type ColumnVisibility, type FilterType } from "./types";
import { DrawStatus } from "./status/DrawStatus";
import { SearchBar } from "./search/SearchBar";

export function DrawBody() {
	//States
	const [activeLabel, setActiveLabel] = useState("Todos");
	const [page, setPage] = useState(0);
	const [colums, setColums] = useState<ColumnVisibility>({
		name: { label: "Nome Social", isVisible: true },
		email: { label: "Email", isVisible: true },
		celNumber: { label: "Celular", isVisible: true },
		gender: { label: "Gênero", isVisible: true },
		sector: { label: "Setor", isVisible: true },
		orientation: { label: "Orientação", isVisible: true },
		race: { label: "Cor/Raça", isVisible: true },
		pcd: { label: "PCD", isVisible: true },
		linkedinLink: { label: "Linkedin", isVisible: true },
		isWorkin: { label: "Trabalhando", isVisible: true },
		rent: { label: "Salário", isVisible: true },
	});
	const [filter, setFilter] = useState<FilterType>(() => {
		const initialFilter = Object.fromEntries(
			Object.keys(colums).map(key => [key, ""])
		) as FilterType;

		return initialFilter;
	});
	const [activeFilter, setActiveFilter] = useState<ColumnKey>("name");

	//Other variables
	const background: string =
		"flex flex-col flex-wrap bg-white w-full min-h-screen min-w-full p-4 gap-4";
	const [filteredRows, setFilteredRows] = useState(dataRows);

	useEffect(() => {
		const newFiltered = dataRows.filter((row: (typeof dataRows)[number]) => {
			// Filtro por campo
			const matches = Object.entries(filter).every(([field, value]) => {
				if (!value) return true;

				const rowValue = row[field as keyof typeof row];
				if (rowValue === undefined || rowValue === null) return false;

				return String(rowValue).toLowerCase().includes(value.toLowerCase());
			});

			// Filtro por status
			const matchStatus =
				activeLabel === "Todos"
					? true
					: activeLabel === "Ativos"
						? row.isStudying === true
						: row.isStudying === false;

			return matches && matchStatus;
		});

		setFilteredRows(newFiltered);
	}, [filter, activeLabel]);

	return (
		<div className={background}>
			<DrawStatus
				activeLabel={activeLabel}
				setActiveLabel={setActiveLabel}
				filteredRows={filteredRows}
				setFilteredRows={setFilteredRows}
			/>
			<SearchBar
				filter={filter}
				setFilter={setFilter}
				page={page}
				setPage={setPage}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
				colums={colums}
				setColums={setColums}
				setFilteredRows={setFilteredRows}
				filteredRows={filteredRows}
			/>
		</div>
	);
}
