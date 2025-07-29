import { Button } from "@/components/ui/button";
import {
	Funnel,
	Columns2,
	Download,
	Check,
	File,
	FileText,
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@radix-ui/react-checkbox";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Data, PropsType } from "../types";

export function DrawButtons(props: PropsType) {
	const buttons = [
		{ label: "Filtros", icon: Funnel },
		{ label: "Colunas", icon: Columns2 },
		{ label: "Exportar", icon: Download },
	];
	const buttonProps = {
		variant: "outline",
		size: "default",
	};
	const buttonHover = "bg-white hover:bg-blue-200";
	const popoverBox =
		"w-80 flex flex-col gap-4 border border-b border-slate-400 overflow-y-auto max-h-70";
	const FilterIcon = buttons[0].icon;
	const ColumnIcon = buttons[1].icon;
	const ExportIcon = buttons[2].icon;
	const exportName = "relatório";

	function downloadPdf(rows: Data[]) {
		const doc = new jsPDF({ orientation: "landscape" });
		const visibleKey = Object.keys(props.colums).filter(
			key => props.colums[key as keyof typeof props.colums].isVisible
		);
		const headers = visibleKey.map(
			key => props.colums[key as keyof typeof props.colums].label
		);
		const data = rows.map(row =>
			visibleKey.map(key => {
				if (key === "rent")
					return row.rent.toLocaleString("pt-br", {
						style: "currency",
						currency: "BRL",
					});
				return row[key];
			})
		);

		autoTable(doc, {
			head: [headers],
			body: data,
			startY: 10,
			margin: { left: 10, right: 10 },
		});

		doc.save(exportName + ".pdf");
	}

	function downloadCsv(rows: Data[]) {
		const visibleKey = Object.keys(props.colums).filter(
			key => props.colums[key as keyof typeof props.colums].isVisible
		);
		const header = visibleKey
			.map(key => props.colums[key as keyof typeof props.colums].label || key)
			.join(", ");
		const body = rows
			.map(row =>
				visibleKey
					.map(key => {
						if (key === "rent") {
							const value = row.rent.toLocaleString("pt-br", {
								style: "currency",
								currency: "BRL",
							});
							return `"${value}"`;
						}
						const value = row[key];
						if (typeof value === "string" && value.includes(","))
							return `"${value}"`;
						return value;
					})
					.join(",")
			)
			.join("\n");

		const csvContent = `${header}\n${body}`;
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", exportName + ".csv");
		link.click();
	}

	return (
		<div className="flex w-full">
			<Popover>
				<PopoverTrigger asChild>
					<Button {...buttonProps} className={buttonHover}>
						<FilterIcon />
						{buttons[0].label}
					</Button>
				</PopoverTrigger>
				<PopoverContent className={popoverBox}>
					{Object.entries(props.colums).map(([key, col]) => {
						const isActive = key === props.activeFilter;
						const activeClass = isActive ? "bg-blue-200" : "bg-white";

						return (
							<Button
								{...buttonProps}
								className={`${buttonHover} ${activeClass}`}
								key={key}
								onClick={() => {
									props.setActiveFilter(key);
								}}
							>
								{col.label}
							</Button>
						);
					})}
				</PopoverContent>
			</Popover>

			<div className="flex gap-4 ml-auto">
				<Popover>
					<PopoverTrigger asChild>
						<Button {...buttonProps} className={buttonHover}>
							<ColumnIcon />
							Colunas
						</Button>
					</PopoverTrigger>
					<PopoverContent className={popoverBox}>
						{Object.entries(props.colums).map(([key, col]) => {
							return (
								<div key={key} className="flex gap-2">
									<Checkbox
										id={`checkbox-${key}`}
										checked={col.isVisible}
										onCheckedChange={checked =>
											props.setColums(prev => ({
												...prev,
												[key]: { ...prev[key], isVisible: !!checked },
											}))
										}
									/>
									<div
										className={`w-5 h-5 flex justify-center items-center border border-gray-400
												${col.isVisible ? "bg-blue-600 border-blue-300" : "bg-white"}`}
									>
										{col.isVisible && <Check className="w-4 h-4 text-white" />}
									</div>
									<label
										htmlFor={`checkbox-${key}`}
										className="flex justify-start items-start cursor-pointer select-none gap-2"
									>
										{col.label}
									</label>
								</div>
							);
						})}
					</PopoverContent>
				</Popover>
				<Popover>
					<PopoverTrigger asChild>
						<Button {...buttonProps} className={buttonHover}>
							<ExportIcon />
							{buttons[2].label}
						</Button>
					</PopoverTrigger>
					<PopoverContent className={popoverBox}>
						<Button
							{...buttonProps}
							onClick={() => downloadPdf(props.filteredRows)}
							className={buttonHover}
						>
							<FileText />
							Exportar como PDF
						</Button>
						<Button
							{...buttonProps}
							onClick={() => downloadCsv(props.filteredRows)}
							className={buttonHover}
						>
							<File />
							Exportar como CSV
						</Button>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
