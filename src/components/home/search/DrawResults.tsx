import { Button } from "@/components/ui/button";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
	type ColumnVisibility,
	type Data,
	type Stats,
} from "../../../pages/home/types";
import { rowsPerPage } from "../utils/globalValues";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import type * as collection from "../../../types/requests/index";
import StudentsForm from "./StudentsForm";
import Modal from "../Modal";
interface DrawResultsProps {
	visibleRows: Data[];
	startPage: number;
	endPage: number;
	rowsPerPage: number;
	updateHome: () => void;
	columns: ColumnVisibility;
	states: {
		page: number;
		setPage: React.Dispatch<React.SetStateAction<number>>;
		stats?: Stats;
	};
}

export function DrawResults(props: DrawResultsProps) {
	const buttonProps = {
		variant: "outline",
		size: "default",
	} as const;
	const columnsList = Object.entries(props.columns).map(([key, value]) => ({
		key,
		...value,
	}));

	function pagination() {
		const nextPage = props.states.page + 1;
		const prevPage = props.states.page - 1;
		const pageNumbers = [prevPage, props.states.page, nextPage];
		const totalPages = Math.ceil(
			(props.states.stats?.total || 0) / rowsPerPage
		);

		return (
			<div className="flex gap-1 justify-end items-end text-black">
				<Button
					{...buttonProps}
					onClick={() => {
						if (prevPage >= 0) props.states.setPage(prevPage);
					}}
				>
					<ChevronLeft />
				</Button>
				{pageNumbers
					.filter(p => p >= 0 && p < totalPages)
					.map(p => {
						const isActive = props.states.page === p;

						return (
							<Button
								className={`flex justify-end items-end ${isActive ? " font-bold text-black" : "text-slate-400"}`}
								key={p}
								{...buttonProps}
								onClick={() => {
									props.states.setPage(p);
								}}
							>
								{p + 1}
							</Button>
						);
					})}
				<Button
					{...buttonProps}
					onClick={() => {
						if (nextPage < totalPages) props.states.setPage(nextPage);
					}}
				>
					<ChevronRight />
				</Button>
			</div>
		);
	}

	const table = useReactTable({
		data: props.visibleRows,
		columns: columnsList
			.filter(f => f.isVisible)
			.map(col => ({
				id: col.key,
				enableHiding: col.isVisible,
				header: col.label,
			})),
		getCoreRowModel: getCoreRowModel(),
	});

	const [open, setOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<
		collection.StudentsParameters | undefined
	>(undefined);

	useEffect(() => {
		if (open) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [open]);

	const handleModal = (item: collection.StudentsParameters) => {
		setSelectedItem(item);
		setOpen(true);
	};

	return (
		<>
			<div className="w-full">
				<div className="overflow-hidden rounded-md border">
					<Table className="border-collapse">
						<TableHeader className="bg-white border-b border-gray-200 text-zinc-400 font-bold">
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id}>
									<Button variant="ghost" className="h-8 w-8 p-0"></Button>
									{headerGroup.headers.map(header => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>

						<TableBody className="text-black font-medium">
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow key={row.id} className="border-b border-gray-200">
										<TableCell>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0"
												onClick={() => {
													handleModal(
														row.original as unknown as collection.StudentsParameters
													);
												}}
											>
												<MoreHorizontal />
											</Button>
										</TableCell>
										{row.getVisibleCells().map(cell => (
											<TableCell
												key={cell.id}
												className="whitespace-nowrap px-4 py-2 min-w-[200px]"
											>
												{String(cell.row.original[cell.column.id]) == "null"
													? "-"
													: String(cell.row.original[cell.column.id])}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={
											columnsList.filter(col => col.isVisible).length + 1
										}
										className="h-24 text-center"
									>
										Nenhum dado encontrado
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="flex justify-between border-b border-gray-200">
				<p className="p-4 text-slate-400">
					Mostrando {props.startPage + 1} a {props.endPage} de{" "}
					{props.states.stats?.total || 0} resultados
				</p>
				<div className="p-4">{pagination()}</div>
			</div>

			<Modal
				isOpen={open}
				onClose={() => setOpen(false)}
				title="Detalhes do Estudante"
			>
				{selectedItem && (
					<StudentsForm
						data={selectedItem}
						className="h-[600px] p-4"
						cancelar={() => setOpen(false)}
						updateHome={props.updateHome}
					/>
				)}
			</Modal>
		</>
	);
}
