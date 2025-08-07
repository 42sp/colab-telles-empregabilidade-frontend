import { use, useEffect, useState } from "react";
import {
	type ColumnKey,
	type ColumnVisibility,
	type Data,
	type FilterType,
} from "../../pages/home/types";
import { DrawStatus } from "./status/DrawStatus";
import { SearchBar } from "./search/SearchBar";
import { useServices } from "@/hooks/useServices";
import type { StudentsParameters } from "@/types/requests";

export function DrawBody() {
	const $service = useServices();
	const [dataRows, setDataRows] = useState<StudentsParameters[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const response = await $service.students();
				console.log("response: ", response);
				console.log("response data: ", response.data);
				setDataRows(response.data);
			} catch (error) {
				console.error("Failed to fetch students:", error);
			}
		})();
	}, [$service]);

	useEffect(() => {
		console.log("Data Rows:", dataRows);
	}, [dataRows]);
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
	// const [filter, setFilter] = useState<FilterType>(() => {
	// 	const initialFilter = Object.fromEntries(
	// 		(Object.keys(colums) as ColumnKey[]).map(key => [key as ColumnKey, ""])
	// 	) as FilterType;

	// 	return initialFilter as FilterType;
	// });

	const [activeFilter, setActiveFilter] = useState<ColumnKey>("name");

	const [filter, setFilter] = useState<FilterType>(() => {
		const saved = sessionStorage.getItem("userFilter");

		if (saved) {
			try {
				return JSON.parse(saved) as FilterType;
			} catch (error) {
				console.log(error);
			}
		}

		const initialFilter = Object.fromEntries(
			(Object.keys(colums) as ColumnKey[]).map(key => [key as ColumnKey, ""])
		) as FilterType;

		return initialFilter as FilterType;
	});

	useEffect(() => {
		sessionStorage.setItem("userFilter", JSON.stringify(filter));
	}, [filter]);

	//Other variables
	const background: string =
		"flex flex-col flex-wrap bg-white w-full min-h-screen min-w-full p-4 gap-4";
	const [filteredRows, setFilteredRows] = useState(dataRows);

	useEffect(() => {
		const newFiltered = dataRows.filter((row: (typeof dataRows)[number]) => {
			// Filtro por campo
			const matches = (Object.entries(filter) as [keyof Data, string][]).every(
				([field, value]) => {
					if (!value) return true;

					const rowValue = row[field];
					if (rowValue === undefined || rowValue === null) return false;

					return String(rowValue).toLowerCase().includes(value.toLowerCase());
				}
			);

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
				dataRows={dataRows}
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
