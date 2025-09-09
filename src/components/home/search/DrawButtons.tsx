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
import type {
	Data,
	PropsType,
	ColumnKey,
	StudentsQuery,
} from "../../../pages/home/types";
import { useServices } from "@/hooks/useServices";

export function DrawButtons(props: PropsType) {
	const buttons = [
		{ label: "Filtros", icon: Funnel },
		{ label: "Colunas", icon: Columns2 },
		{ label: "Exportar", icon: Download },
	];
	const $service = useServices();
	const buttonProps = {
		variant: "outline",
		size: "default",
	} as const;
	const buttonHover = "bg-white hover:bg-blue-200";
	const popoverBox =
		"w-80 flex flex-col gap-4 border border-b border-slate-400 overflow-y-auto max-h-70";
	const FilterIcon = buttons[0].icon;
	const ColumnIcon = buttons[1].icon;
	const ExportIcon = buttons[2].icon;
	const exportName = "relatório";

	async function downloadPdf() {
		const rows: Data[] = [];
		const limitPerRequest = 50; // limite que o backend permite por request
		let skip = 0;
		let total = 0;

		do {
			const partialQuery: StudentsQuery = {
				...props.query,
				$limit: limitPerRequest,
				$skip: skip,
			};

			const response = await $service.students(partialQuery);
			const data: Data[] = response.data.data;
			total = response.data.total;

			rows.push(...data); // concatena resultados
			skip += limitPerRequest; // avança o skip
		} while (rows.length < total);

		// Agora 'rows' contém todos os registros, podemos gerar o PDF
		const visibleKey = Object.keys(props.colums).filter(
			key => props.colums[key as keyof typeof props.colums].isVisible
		);
		const format: string =
			visibleKey.length <= 25
				? "a4"
				: visibleKey.length <= 50
					? "a3"
					: visibleKey.length <= 75
						? "a2"
						: "a1";

		const doc = new jsPDF({
			orientation: "landscape",
			unit: "mm",
			format: format,
		});

		const headers = visibleKey.map(
			key => props.colums[key as keyof typeof props.colums].label
		);

		const data = rows.map(row =>
			visibleKey.map(key => {
				const typedKey = key as keyof Data;

				if (key === "compensation") {
					const value = row[typedKey];
					const num: number = Number(value);
					const zeroValue = new Intl.NumberFormat("pt-BR", {
						style: "currency",
						currency: "BRL",
					}).format(0);
					const formattedValue = new Intl.NumberFormat("pt-BR", {
						style: "currency",
						currency: "BRL",
					}).format(num);

					if (value === null || value === undefined || isNaN(num))
						return zeroValue;
					return formattedValue;
				}

				if (row[typedKey] !== null) {
					const input = row[typedKey];
					let value: string = String(input).trim();
					if (typeof input === "boolean") value = input ? "Sim" : "Não";
					return value === "" ? "-" : value;
				}

				return "-";
			})
		);

		autoTable(doc, {
			head: [headers],
			body: data,
			startY: 10,
			margin: { left: 5, right: 5 },
			styles: {
				fontSize: 5,
				cellPadding: 0.5,
				overflow: "linebreak",
				halign: "center",
			},
			headStyles: {
				fontSize: 6,
				fontStyle: "bold",
				fillColor: [200, 200, 200],
				halign: "center",
			},
			tableWidth: "auto",
			theme: "grid",
			showHead: "everyPage",
			pageBreak: "auto",
			rowPageBreak: "avoid",
		});

		doc.save(exportName + ".pdf");
	}

	async function downloadCsv() {
		const rows: Data[] = [];
		const limitPerRequest = 50; // limite por request do backend
		let skip = 0;
		let total = 0;

		do {
			const partialQuery: StudentsQuery = {
				...props.query,
				$limit: limitPerRequest,
				$skip: skip,
			};

			const response = await $service.students(partialQuery);
			const data: Data[] = response.data.data;
			total = response.data.total;

			rows.push(...data); // concatena resultados
			skip += limitPerRequest;
		} while (rows.length < total);

		// Monta CSV
		const visibleKey = Object.keys(props.colums).filter(
			key => props.colums[key as keyof typeof props.colums].isVisible
		);
		const header = visibleKey
			.map(key => props.colums[key as keyof typeof props.colums].label || key)
			.join(",");

		const body = rows
			.map(row =>
				visibleKey
					.map(key => {
						const typedKey = key as keyof Data;
						const value = row[typedKey];
						const str =
							value !== null && value !== undefined ? String(value).trim() : "";

						if (key === "compensation") {
							const num: number = Number(value);
							return isNaN(num) ? "0.00" : num.toFixed(2);
						}

						if (str.includes(",") || str.includes('"') || str.includes("'")) {
							return `"${str}"`;
						}

						return str === "" ? `""` : str;
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
						const typedKey = key as ColumnKey;
						return (
							<Button
								{...buttonProps}
								className={`${buttonHover} ${activeClass}`}
								key={key}
								onClick={() => {
									props.setActiveFilter(typedKey);
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
							const typedKey = key as ColumnKey;
							return (
								<div key={key} className="flex gap-2">
									<Checkbox
										id={`checkbox-${key}`}
										checked={col.isVisible}
										onCheckedChange={checked =>
											props.setColums(prev => ({
												...prev,
												[key]: { ...prev[typedKey], isVisible: !!checked },
											}))
										}
									>
										<div
											className={`w-5 h-5 flex justify-center items-center cursor-pointer border border-gray-400
												${col.isVisible ? "bg-blue-600 border-blue-300" : "bg-white"}`}
										>
											{col.isVisible && (
												<Check className="w-4 h-4 text-white" />
											)}
										</div>
									</Checkbox>
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
							onClick={() => downloadPdf()}
							className={buttonHover}
						>
							<FileText />
							Exportar como PDF
						</Button>
						<Button
							{...buttonProps}
							onClick={() => downloadCsv()}
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
