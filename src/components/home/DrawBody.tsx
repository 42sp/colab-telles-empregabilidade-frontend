import { useEffect, useState } from "react";
import {
	type ColumnKey,
	type ColumnVisibility,
	type FilterType,
	type StateBundle,
	type Stats,
} from "../../pages/home/types";
import { DrawStatus } from "./status/DrawStatus";
import { SearchBar } from "./search/SearchBar";
import type { StudentsParameters } from "@/types/requests";
import { myColumns } from "./utils/columns";
import { useBuildQuery } from "./utils/buildQuery";
import { debounceDelay, rowsPerPage } from "./utils/globalValues";
import { loadFromSession } from "./utils/loadSessionStorage";
import { useFetchData } from "./utils/fetchData";
import { useFetchStats } from "./utils/fetchStats";

export function DrawBody() {
	const filtersSave: string = "userFilter";
	const columnsSave: string = "userColumns";
	//#region States
	const [dataRows, setDataRows] = useState<StudentsParameters[]>([]);
	const [stats, setStats] = useState<Stats>({
		total: 0,
		working: 0,
		notWorking: 0,
		avgCompensation: 0,
	});

	//States
	const [activeLabel, setActiveLabel] = useState("Todos");
	const [page, setPage] = useState(0);
	const [colums, setColums] = useState<ColumnVisibility>(() => {
		return loadFromSession(columnsSave, myColumns);
	});

	const [activeFilter, setActiveFilter] = useState<ColumnKey>("name");
	const [filter, setFilter] = useState<FilterType>(() => {
		return loadFromSession(
			filtersSave,
			Object.fromEntries(
				(Object.keys(colums) as ColumnKey[]).map(key => [key as ColumnKey, ""])
			) as FilterType
		);
	});
	const [debounce, setDebounce] = useState(filter);
	//#endregion

	const buildQuery = useBuildQuery(activeLabel, filter);
	const fetchData = useFetchData(buildQuery, setDataRows);
	const fetchStats = useFetchStats(buildQuery, setStats);

	//#region useEffects

	//Salva as colunas
	useEffect(() => {
		sessionStorage.setItem(columnsSave, JSON.stringify(colums));
	}, [colums]);

	//Salva os filtros
	useEffect(() => {
		sessionStorage.setItem(filtersSave, JSON.stringify(filter));
	}, [filter]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounce(filter);
		}, debounceDelay);

		return () => clearTimeout(timer);
	}, [filter]);

	useEffect(() => {
		setPage(0);
	}, [activeLabel]);
	useEffect(() => {
		const fetch = async () => {
			try {
				await fetchStats();
			} catch (error) {
				console.error("Failed to fetch students:", error);
			}
		};
		fetch();
	}, [debounce, activeLabel, activeFilter]);
	useEffect(() => {
		const run = async () => {
			await fetchData(page * rowsPerPage);
		};
		run();
	}, [filter, activeLabel, activeFilter, page]);

	const [filteredRows, setFilteredRows] = useState(dataRows);

	useEffect(() => {
		setFilteredRows(dataRows);
	}, [dataRows]);

	//#endregion

	const states: StateBundle = {
		filter,
		setFilter,
		page,
		setPage,
		activeFilter,
		setActiveFilter,
		colums,
		setColums,
		filteredRows,
		setFilteredRows,
		activeLabel,
		setActiveLabel,
		stats,
		setStats,
	};
	const background: string =
		"flex flex-col bg-white w-full min-h-screen max-w-full p-4 gap-4 overflow-hidden";

	return (
		<div className={background}>
			<DrawStatus
				activeLabel={activeLabel}
				setActiveLabel={setActiveLabel}
				filteredRows={filteredRows}
				dataRows={dataRows}
				stats={stats}
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
				stats={stats}
				query={query}
				updateHome={() => {
					fetchStats();
					fetchData(groupIndex);
				}}
			/>
		</div>
	);
}
