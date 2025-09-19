import { useCallback, useEffect, useState } from "react";
import {
	type ColumnKey,
	type ColumnVisibility,
	type FilterType,
	type StateBundle,
	type Stats,
} from "../../pages/home/types";
import { DrawStatus } from "./status/DrawStatus";
import { SearchBar } from "./search/SearchBar";
import { useServices } from "@/hooks/useServices";
import type { StudentsParameters } from "@/types/requests";
import { myColumns } from "./utils/columns";
import { useBuildQuery } from "./utils/buildQuery";

export function DrawBody() {
	//#region States
	const $service = useServices();
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
		const savedColumns = sessionStorage.getItem("userColumns");

		if (savedColumns) {
			try {
				return JSON.parse(savedColumns) as ColumnVisibility;
			} catch (error) {
				console.log("Error: couldn't load the saved columns: ", error);
			}
		}

		return myColumns;
	});

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
	const [debounce, setDebounce] = useState(filter);
	//#endregion

	//#region useEffects

	//Salva as colunas
	useEffect(() => {
		sessionStorage.setItem("userColumns", JSON.stringify(colums));
	}, [colums]);

	//Salva os filtros
	useEffect(() => {
		sessionStorage.setItem("userFilter", JSON.stringify(filter));
	}, [filter]);

	const rowsPerPage: number = 10;
	const buildQuery = useBuildQuery(activeLabel, filter);

	const fetchData = useCallback(
		async (skipIndex: number) => {
			try {
				const query = buildQuery(skipIndex);
				const response = await $service.students(query);
				setDataRows(response.data.data);
			} catch (error) {
				console.error("Failed to fetch students:", error);
			}
		},
		[$service, buildQuery]
	);

	const fetchStats = useCallback(async () => {
		try {
			const query = buildQuery(0);
			const response = await $service.studentsStats(query);

			setStats({
				total: response.data.total,
				working: response.data.working,
				notWorking: response.data.notWorking,
				avgCompensation: Number(response.data.avgCompensation),
			});
		} catch (error) {
			console.error("Failed to fetch students:", error);
		}
	}, [$service, buildQuery]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounce(filter);
		}, 150);

		return () => clearTimeout(timer);
	}, [filter]);

	useEffect(() => {
		setPage(0);
	}, [activeLabel]);
	useEffect(() => {
		// fetchStats();
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

	//#endregion
	const background: string =
		"flex flex-col bg-white w-full min-h-screen max-w-full p-4 gap-4 overflow-hidden";
	return (
		<div className={background}>
			<DrawStatus {...states} />
			<SearchBar {...states} />
		</div>
	);
}
