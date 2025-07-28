import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dataRows } from "../types";

export function DrawResults(props) {
	const visibleColums = Object.entries(props.colums).filter(
		([_, col]) => col.isVisible
	);

	function pagination() {
		const nextPage = props.page + 1;
		const prevPage = props.page - 1;
		const pageNumbers = [prevPage, props.page, nextPage];

		return (
			<div className="flex justify-end items-end text-black">
				<Button
					{...props.buttonProps}
					onClick={() => {
						if (prevPage >= 0) props.setPage(prevPage);
					}}
				>
					<ChevronLeft />
				</Button>
				{pageNumbers
					.filter(p => p >= 0 && p < dataRows.length / 5)
					.map(p => {
						const isActive = props.page === p;

						return (
							<Button
								className={`flex justify-end items-end ${isActive ? " font-bold text-black" : "text-slate-400"}`}
								key={p}
								{...props.buttonProps}
								onClick={() => {
									props.setPage(p);
								}}
							>
								{p + 1}
							</Button>
						);
					})}
				<Button
					{...props.buttonProps}
					onClick={() => {
						if (nextPage < dataRows.length / 5) props.setPage(nextPage);
					}}
				>
					<ChevronRight />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col border border-gray-200 rounded-md bg-white min-w-full w-full h-full overflow-x-auto">
			<table className="table-auto border-collapse">
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
