import { Button } from "@/components/ui/button";

import {
	ChevronLeft,
	ChevronRight,
	Edit,
	MoreHorizontal,
} from "lucide-react";
import {
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
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import type * as collection from "../../../types/requests/index";
import StudentsForm from "./StudentsForm";
import Modal from "../Modal";

// import {
// 	ColumnDef,
// 	ColumnFiltersState,
// 	flexRender,
// 	getCoreRowModel,
// 	getFilteredRowModel,
// 	getPaginationRowModel,
// 	getSortedRowModel,
// 	SortingState,
// 	useReactTable,
// 	VisibilityState,
// } from "@tanstack/react-table";


interface DrawResultsProps {
	visibleRows: Data[];
	startPage: number;
	endPage: number;
	filteredRows: Data[];
	rowsPerPage: number;
	stats: Stats;
	updateHome: () => void;
}

export const columns: ColumnDef<collection.StudentsResponse>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nome
					{/* <ArrowUpDown /> */}
				</Button>
			);
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
	},
	{
		accessorKey: "linkedin",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					LinkedIn
					{/* <ArrowUpDown /> */}
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("linkedin")}</div>
		),
	},
	{
		accessorKey: "ismartEmail",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email
					{/* <ArrowUpDown /> */}
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("ismartEmail")}</div>
		),
	},
	{
		accessorKey: "phoneNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Telefone
					{/* <ArrowUpDown /> */}
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("phoneNumber")}</div>
		),
	},
	{
		accessorKey: "gender",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Sexo
					{/* <ArrowUpDown /> */}
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("gender")}</div>
		),
	},
	{
		accessorKey: "currentCourseStart",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Data Início
					{/* <ArrowUpDown /> */}
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("currentCourseStart")}</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: () => {
			return (
				<Button variant="ghost" className="h-8 w-8 p-0">
					<Edit />
				</Button>
			);
		},
	},
];

export function DrawResults(props: DrawResultsProps) {
	const visibleColumns: collection.StudentsParameters = Object.entries(
		props.colums || {}
	).filter(([_, col]) => col.isVisible);
	const buttonProps = {
		variant: "outline",
		size: "default",
	} as const;

	function pagination() {
		const nextPage = props.states.page + 1;
		const prevPage = props.states.page - 1;
		const pageNumbers = [prevPage, props.states.page, nextPage];
		const totalPages = Math.ceil(props.states.stats.total / rowsPerPage);

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
				<div className="inline-flex bg-white w-10 h-6 rounded-xl justify-center items-center">
					{value}
				</div>
			);
		return value;
	}

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		visibleColumns,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	// console.log(props.colums);

	const [open, setOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<
		collection.StudentsResponse | undefined
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

	const handleModal = (item: collection.StudentsResponse) => {
		setSelectedItem(item);
		setOpen(true);
	};

	return (
		<div className="flex flex-col flex-1 border border-gray-200 rounded-md bg-white max-w-full">
			<div className="max-w-full overflow-x-auto">
				<Table className="table-auto border-collapse">
					<TableHeader className="bg-white border-b border-gray-200 text-zinc-400 font-bold">
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody className="text-black font-medium text-sm">
						{props.visibleRows.map((row, i) => (
							<TableRow key={i} className="border-b border-gray-200">
								<TableCell>{String(row.name)}</TableCell>
								<TableCell>{String(row.linkedin)}</TableCell>
								<TableCell>{String(row.ismartEmail)}</TableCell>
								<TableCell>{String(row.phoneNumber)}</TableCell>
								<TableCell>{String(row.gender)}</TableCell>
								<TableCell>
									{row.currentCourseStart
										? String(
												new Date(
													typeof row.currentCourseStart === "string" ||
													typeof row.currentCourseStart === "number"
														? row.currentCourseStart
														: ""
												).toLocaleDateString("pt-BR", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
												})
											)
										: "-"}
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										className="h-8 w-8 p-0"
										onClick={() => {
											handleModal(row);
										}}
									>
										<Modal
											isOpen={open}
											onClose={() => setOpen(false)}
											title="Detalhes do Estudante"
										>
											<StudentsForm
												data={selectedItem}
												className="h-[600px] p-4"
												cancelar={() => setOpen(false)}
												updateHome={props.updateHome}
											/>
										</Modal>
										<MoreHorizontal />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex justify-between border-b border-gray-200">
				<p className="p-4 text-slate-400">
					Mostrando {props.startPage + 1} a {props.endPage} de{" "}
					{props.states.stats.total} resultados
				</p>
				<div className="p-4">{pagination()}</div>
			</div>
		</div>
	);
}
