import { Search, X } from "lucide-react";
import { DrawResults } from "./DrawResults";
import { DrawButtons } from "./DrawButtons";
import type { StateBundle } from "../../../pages/home/types";
import { useEffect, useState } from "react";
import { InputFilter } from "../utils/inputFilter";
import { debounceDelay, rowsPerPage } from "../utils/globalValues";

export function SearchBar(props: StateBundle) {
	const [input, setInput] = useState<string>(
		props.filter[props.activeFilter] || ""
	);
	//Page config
	const startPage = props.page * rowsPerPage;
	const pagesPerGroup = 1;
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
	}, [props.activeFilter, props.filter]);

	useEffect(() => {
		const timer = setTimeout(() => {
			const myInput = input.trim();
			if (myInput !== "-") {
				props.setFilter(prev => ({ ...prev, [props.activeFilter]: myInput }));
				props.setPage(0);
			}
		}, debounceDelay);

		return () => clearTimeout(timer);
	}, [input]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex bg-white w-full gap-4 p-4 border border-b rounded-md">
				<InputFilter
					className="w-64"
					value={input}
					placeholder={props.colums[props.activeFilter]?.label || ""}
					onChange={e => {
						setInput(e.target.value);
					}}
					Icon={Search}
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
				columns={props.colums}
				states={props}
				visibleRows={visibleRows}
				startPage={startPage}
				endPage={endPage}
				rowsPerPage={rowsPerPage}
				updateHome={props.updateHome}
			/>
		</div>
	);
}
