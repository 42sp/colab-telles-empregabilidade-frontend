import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ColumnsMap, type Data } from "../../../pages/home/types";

interface DrawResultsProps {
	colums: ColumnsMap;
	visibleRows: Data[];
	page: number;
	setPage: (page: number) => void;
	startPage: number;
	endPage: number;
	filteredRows: Data[];
	rowsPerPage: number;
}

export function DrawResults(props: DrawResultsProps) {
	const visibleColums = Object.entries(props.colums).filter(
		([_, col]) => col.isVisible
	);
	const buttonProps = {
		variant: "outline",
		size: "default",
	} as const;

	function pagination() {
		const nextPage = props.page + 1;
		const prevPage = props.page - 1;
		const pageNumbers = [prevPage, props.page, nextPage];
		const totalPages = Math.ceil(props.filteredRows.length / props.rowsPerPage);

		return (
			<div className="flex gap-1 justify-end items-end text-black">
				<Button
					{...buttonProps}
					onClick={() => {
						if (prevPage >= 0) props.setPage(prevPage);
					}}
				>
					<ChevronLeft />
				</Button>
				{pageNumbers
					.filter(p => p >= 0 && p < totalPages)
					.map(p => {
						const isActive = props.page === p;

						return (
							<Button
								className={`flex justify-end items-end ${isActive ? " font-bold text-black" : "text-slate-400"}`}
								key={p}
								{...buttonProps}
								onClick={() => {
									props.setPage(p);
								}}
							>
								{p + 1}
							</Button>
						);
					})}
				<Button
					{...buttonProps}
					onClick={() => {
						if (nextPage < totalPages) props.setPage(nextPage);
					}}
				>
					<ChevronRight />
				</Button>
			</div>
		);
	}

	function showContent(key: string, row: string, type: string): string {
		if (key === "compensation") {
			const num = Number(row);
			return new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(isNaN(num) ? 0 : num);
		}
		if (
			row === null ||
			row === undefined ||
			row === "" ||
			row === "null" ||
			row === "undefined"
		)
			return "-";
		if (type === "boolean") return row === "true" ? "Sim" : "Não";

		return row === "0" ? "-" : row;
	}

	function renderCellContent(key: string, row: string, type: string) {
		const value: string = showContent(key, row, type);

		// key === "working" && value === "Sim" - only working students
		if (value === "Sim")
			return (
				<div className="inline-flex bg-black text-white w-10 h-6 rounded-xl justify-center items-center">
					{value}
				</div>
			);
		else if (value === "Não")
			return (
				<div className="inline-flex bg-white w-10 h-6 rounded-xl justify-center items-center">{value}</div>
			);
		return value;
	}

	return (
		<div className="flex flex-col flex-1 border border-gray-200 rounded-md bg-white max-w-full">
			<div className="max-w-full overflow-x-auto">
				<table className="min-w-[3000px] table-auto border-collapse">
					{/* Header */}
					<thead className="bg-white border-b border-gray-200 text-zinc-400 font-bold">
						<tr>
							{visibleColums.map(([key, col]) => (
								<th
									key={key}
									className="text-left px-6 py-3 min-w-[180px] whitespace-nowrap"
								>
									{col.label}
								</th>
							))}
						</tr>
					</thead>

					{/* Body */}
					<tbody className="text-black font-medium text-sm">
						{props.visibleRows.map((row, i) => (
							<tr key={i} className="border-b border-gray-200">
								{visibleColums.map(([key]) => (
									<td
										key={key}
										className="px-4 py-2 truncate max-w-[200px]"
										title={String(row[key as keyof typeof row])}
									>
										{renderCellContent(key, String(row[key]), typeof row[key])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/*	botao para atualizar o estado das paginas*/}
			<div className="flex justify-between border-b border-gray-200">
				<p className="p-4 text-slate-400">
					Mostrando {props.startPage + 1} a {props.endPage} de{" "}
					{props.filteredRows.length} resultados
				</p>
				<div className="p-4">{pagination()}</div>
			</div>
		</div>
	);
}
