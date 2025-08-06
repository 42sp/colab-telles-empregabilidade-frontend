import { useEffect, useState } from "react";
import { type Data, type FilterType } from "../../pages/home/types";
import { DrawStatus } from "./status/DrawStatus";
import { SearchBar } from "./search/SearchBar";
import { client } from "@/lib/feathers";
import { type ColumnsMap } from "../../pages/home/types";
import { ColumnsPath } from "../../pages/home/types";

export function DrawBody() {
	//States
	const [activeLabel, setActiveLabel] = useState("Todos");
	const [page, setPage] = useState(0);
	const [colums, setColums] = useState<ColumnsMap>({});
	const [dataRows, setDataRows] = useState<Data[]>([]);
	const [activeFilter, setActiveFilter] = useState<string>("name");
	const [filteredRows, setFilteredRows] = useState<Data[]>([]);

	const [filter, setFilter] = useState<FilterType>(() => {
		const saved = sessionStorage.getItem("userFilter");

		if (saved) {
			try {
				return JSON.parse(saved) as FilterType;
			} catch (error) {
				console.log(error);
			}
		}
		return {};
	});
	//Colums
	useEffect(() => {
		client.rest
			.get("/columns/columns")
			.then(data => setColums(data))
			.catch(console.error);
	}, []);
	//DataRows
	useEffect(() => {
		client.rest
			.get("/columns/students")
			.then(data => {
				setDataRows(data);
				console.log(dataRows);
			})
			.catch(console.error);
	}, []);
	//filter
	useEffect(() => {
		if (Object.keys(filter).length === 0 && Object.keys(colums).length > 0) {
			const initialFilter = Object.fromEntries(
				Object.keys(colums).map(key => [key, ""])
			) as FilterType;

			setFilter(initialFilter);
		}
	}, [colums]);
	useEffect(() => {
		sessionStorage.setItem("userFilter", JSON.stringify(filter));
	}, [filter]);
	//filteredRows
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

	const background: string =
		"flex flex-col flex-wrap bg-white w-full min-h-screen min-w-full p-4 gap-4";
	return (
		<div className={background}>
			<DrawStatus
				activeLabel={activeLabel}
				setActiveLabel={setActiveLabel}
				filteredRows={filteredRows}
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
