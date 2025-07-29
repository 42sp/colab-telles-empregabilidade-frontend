import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DrawResults } from "./DrawResults";
import { DrawButtons } from "./DrawButtons";
import type { PropsType } from "../types";

export function SearchBar(props: PropsType) {
	const buttonProps = {
		variant: "outline",
		size: "default",
	};

	const inputValue = props.filter[props.activeFilter] || "";

	function updateFilter(value: string) {
		props.setFilter(prev => ({ ...prev, [props.activeFilter]: value }));
		props.setPage(0);
	}
	//Page config
	const rowsPerPage = 5;
	const startPage = props.page * rowsPerPage;
	const visibleRows = props.filteredRows.slice(
		startPage,
		startPage + rowsPerPage
	);
	const endPage = Math.min(
		(props.page + 1) * rowsPerPage,
		props.filteredRows.length
	);

	function removeFilter(toRemove: string) {
		props.setFilter(prev => ({
			...prev,
			[toRemove]: "",
		}));
		props.setPage(0);
	}
	return (
		<div className="flex flex-col gap-4">
			<div className="flex bg-white w-full gap-4 p-4 border border-b rounded-md">
				<Input
					className="w-64"
					value={inputValue}
					placeholder="Buscar estudante..."
					onChange={e => {
						props.setFilter(prev => ({
							...prev,
							[props.activeFilter]: e.target.value,
						}));
					}}
					onKeyDown={k => {
						if (k.key === "Enter") {
							const input = k.target as HTMLInputElement;
							updateFilter(input.value);
						}
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
							{props.colums[key]?.label || key}:{value}
							<button className="h-5 w-5" onClick={() => removeFilter(key)}>
								<X />
							</button>
						</span>
					))}
			</div>
			<DrawResults
				{...props}
				visibleRows={visibleRows}
				buttonProps={buttonProps}
				startPage={startPage}
				endPage={endPage}
			/>
		</div>
	);
}
