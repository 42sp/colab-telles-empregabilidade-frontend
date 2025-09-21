import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DrawResults } from "./DrawResults";
import { DrawButtons } from "./DrawButtons";
import type { PropsType } from "../../../pages/home/types";
import { useEffect, useState } from "react";

export function SearchBar(props: PropsType) {
	const [input, setInput] = useState<string>(
		props.filter[props.activeFilter] || ""
	);

	function updateFilter(value: string) {
		props.setFilter(prev => ({ ...prev, [props.activeFilter]: value }));
		props.setPage(0);
	}
	//Page config
	const rowsPerPage = 10;
	const startPage = props.page * rowsPerPage;
	const pagesPerGroup = 3;
	const intraGroupPage = props.page % pagesPerGroup;
	const visibleRows = props.filteredRows.slice(
		intraGroupPage * rowsPerPage,
		intraGroupPage * rowsPerPage + rowsPerPage
	);
	const endPage = Math.min((props.page + 1) * rowsPerPage, props.stats.total);

	function removeFilter(toRemove: string) {
		props.setFilter(prev => ({
			...prev,
			[toRemove]: "",
		}));
		props.setPage(0);
	}

	useEffect(() => {
		setInput(props.filter[props.activeFilter] || "");
	}, [props.filter, props.activeFilter]);

	useEffect(() => {
		const timer = setTimeout(() => {
			const myInput = input.trim();
			if (myInput !== "-") {
				updateFilter(myInput);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [input, props.setFilter, props.activeFilter]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex bg-white w-full gap-4 p-4 border border-b rounded-md">
				<Input
					className="w-64"
					value={input}
					placeholder="Buscar estudante..."
					onChange={e => {
						setInput(e.target.value);
					}}
				/>
				<DrawButtons {...props} />
			</div>
			<div className="flex items-start gap-2">
				{Object.entries(props.filter)
					.filter(([_, value]) => value.trim() !== "")
					.map(([key, value]) => (
						<span
							key={key}
							className="flex font-medium bg-slate-200 px-4 py-1 gap-4 border border-gray-200 rounded-md"
						>
							{props.colums[key as keyof typeof props.colums]?.label || key}:
							{value}
							<button className="h-5 w-5" onClick={() => removeFilter(key)}>
								<X />
							</button>
						</span>
					))}
			</div>
			<DrawResults
				{...props}
				visibleRows={visibleRows}
				startPage={startPage}
				endPage={endPage}
				rowsPerPage={rowsPerPage}
				updateHome={props.updateHome}
			/>
		</div>
	);
}
