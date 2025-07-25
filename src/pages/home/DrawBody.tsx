import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Funnel, Columns2, Download, ChevronLeft, ChevronRight, Check, File, FileText, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@radix-ui/react-checkbox";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { dataRows } from "./types";
import { DrawStatus } from "./status/DrawStatus";
import { SearchBar } from "./search/SearchBar";

export function	DrawBody()
{
	//States
	const [activeLabel, setActiveLabel] = useState("Todos");
	const [page, setPage] = useState(0);
	const [colums, setColums] = useState({
		name: {label: "Nome Social", isVisible: true},
		email: {label: "Email", isVisible: true},
		celNumber: {label: "Celular", isVisible: true},
		gender: {label: "Gênero", isVisible: true},
		sector: {label: "Setor", isVisible: true},
		orientation: {label: "Orientação", isVisible: true},
		race: {label: "Cor/Raça", isVisible: true},
		pcd: {label: "PCD", isVisible: true},
		linkedinLink: {label: "Linkedin", isVisible: true},
		isWorkin: {label: "Trabalhando", isVisible: true},
		rent: {label: "Salário", isVisible: true},
	});
	const [filter, setFilter] = useState(() => {
		const initialFilter = Object.fromEntries(Object.keys(colums).map(key => [key, ""]));

		return initialFilter;
	});
	const	[activeFilter, setActiveFilter] = useState("name");

	//Other vaariables
	const background: string =
		"flex flex-col flex-wrap bg-white border border-b border-gray-300 w-full min-h-screen p-4 gap-4";

	
	//deve virar um estado
	// const	filteredRows = dataRows.filter(row => {
	// 	//Filtro por campo (Nome, setor, etc...)
	// 	const	matches = Object.entries(filter).every(([field, value]) => {
	// 		if (!value)
	// 			return true;

	// 		const	rowValue = row[field];

	// 		if (rowValue === undefined || rowValue === null)
	// 			return false;
	// 		return (String(rowValue).toLowerCase().includes(value.toLowerCase()));
	// 	});

	// 	//Filtro por ativo, inativo, todos
	// 	const matchStatus =
	// 		activeLabel === "Todos"
	// 			? true
	// 			: activeLabel === "Ativos"
	// 			? row.isStudying === true
	// 			: row.isStudying === false;
		
	// 	return (matches && matchStatus);
	// });

	const [filteredRows, setFilteredRows] = useState(dataRows);

	useEffect(() => {
		const newFiltered = dataRows.filter(row => {
			// Filtro por campo
			const matches = Object.entries(filter).every(([field, value]) => {
				if (!value) return true;

				const rowValue = row[field];
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
