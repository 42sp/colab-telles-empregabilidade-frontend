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
			<div className="flex justify-end items-end text-black">
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

	return (
		<div className="flex flex-col border border-gray-200 rounded-md bg-white min-w-full h-full">
			<div className="w-full overflow-x-auto">
				<table className="min-w-[1200px] table-auto border-collapse">
					{/* Header */}
					<thead className="bg-white border-b border-gray-200 text-zinc-400 font-bold">
						<tr>
							{visibleColums.map(([key, col]) => (
								<th key={key} className="text-left px-4 py-2">
									{col.label}
								</th>
							))}
						</tr>
					</thead>

					{/* Body */}
					<tbody className="text-black font-medium">
						{props.visibleRows.map((row, i) => (
							<tr key={i} className="border-b border-gray-200">
								{visibleColums.map(([key]) => (
									<td
										key={key}
										className="px-4 py-2 truncate max-w-[200px]"
										title={String(row[key as keyof typeof row])}
									>
										{key === "rent"
											? new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
												}).format(row[key as keyof typeof row] as number)
											: String(row[key as keyof typeof row])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/*	botao para atualizar o estado das paginas*/}
			<div className="flex border-b border-gray-200">
				<p className="p-4 text-slate-400">
					Mostrando {props.startPage + 1} a {props.endPage} de{" "}
					{props.filteredRows.length} resultados
				</p>
				<div className="ml-auto p-4">{pagination()}</div>
			</div>
		</div>
	);
}
