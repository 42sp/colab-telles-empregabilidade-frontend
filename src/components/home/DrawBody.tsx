import { useEffect, useState } from "react";
import {
	type ColumnKey,
	type ColumnVisibility,
	type FilterType,
	type StateBundle,
	type Stats,
} from "../../pages/home/types";
import { DrawStatus } from "./status/DrawStatus";
import type { StudentsParameters } from "@/types/requests";
import { myColumns } from "./utils/columns";
import { useBuildQuery } from "./utils/buildQuery";
import { rowsPerPage } from "./utils/globalValues";
import { loadFromSession } from "./utils/loadSessionStorage";
import { useFetchData } from "./utils/fetchData";
import { useFetchStats } from "./utils/fetchStats";
import { SearchBar } from "./search/SearchBar";

export function DrawBody() {
	const filtersSave: string = "userFilter";
	const columnsSave: string = "userColumns";
	//#region States
	const [dataRows, setDataRows] = useState<StudentsParameters[]>([]);
	const [filteredRows, setFilteredRows] = useState(dataRows);
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
	const [debounce, setDebounce] = useState<FilterType>(filter);
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

	// useEffect(() => {
	// 	fetchStats();
	// }, [activeLabel, filter]);

	useEffect(() => {
		fetchData(page * rowsPerPage);
	}, [page]);
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
		dataRows,
		updateHome: () => {
			fetchStats();
			fetchData(page * rowsPerPage);
		},
		setDebounce,
	};

	useEffect(() => {
		states.updateHome();
	}, [activeLabel, debounce]);

	useEffect(() => {
		console.log("Data rows updated:", dataRows);
		setFilteredRows(dataRows);
	}, [dataRows, fetchData]);

	const background: string = "flex flex-col bg-white px-6";

	return (
		<div className={background}>
			<DrawStatus {...states} />
			<SearchBar {...states} />
		</div>
	);
}
