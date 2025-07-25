import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Funnel, Columns2, Download, ChevronLeft, ChevronRight, Check, File, FileText, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@radix-ui/react-checkbox";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { dataRows } from "./types";
import { DrawStatus } from "./status/DrawStatus";

export function	DrawBody()
{
	//States
	const [activeLabel, setActiveLabel] = useState("Todos");
	const [page, setPage] = useState(0);
	const [colums, setColums] = useState({
		name: {label: "Nome Social", isVisible: true},
		email: {label: "Email", isVisible: true},
		celNumber: {label: "Celular", isVisible: true},
		gender: {label: "Gênero", isVisible: true},
		sector: {label: "Setor", isVisible: true},
		orientation: {label: "Orientação", isVisible: true},
		race: {label: "Cor/Raça", isVisible: true},
		pcd: {label: "PCD", isVisible: true},
		linkedinLink: {label: "Linkedin", isVisible: true},
		isWorkin: {label: "Trabalhando", isVisible: true},
		rent: {label: "Salário", isVisible: true},
	});
	const [filter, setFilter] = useState(() => {
		const initialFilter = Object.fromEntries(Object.keys(colums).map(key => [key, ""]));

		return initialFilter;
	});
	const	[activeFilter, setActiveFilter] = useState("name");

	//Other vaariables
	const background: string =
		"flex flex-col flex-wrap bg-white border border-b border-gray-300 w-full min-h-screen p-4 gap-4";

	

	const	filteredRows = dataRows.filter(row => {
		//Filtro por campo (Nome, setor, etc...)
		const	matches = Object.entries(filter).every(([field, value]) => {
			if (!value)
				return true;

			const	rowValue = row[field];

			if (rowValue === undefined || rowValue === null)
				return false;
			return (String(rowValue).toLowerCase().includes(value.toLowerCase()));
		});

		//Filtro por ativo, inativo, todos
		const matchStatus =
			activeLabel === "Todos"
				? true
				: activeLabel === "Ativos"
				? row.isStudying === true
				: row.isStudying === false;
		
		return (matches && matchStatus);
	});

	function	searchBar(dataRows)
	{
		const	buttonProps ={
			variant: "outline",
			size: "default",
		};
		
		const	inputValue =  filter[activeFilter] || "";

		function	updateFilter(value:string)
		{
			setFilter(prev => ({...prev, [activeFilter]: value}));
			setPage(0);
		}
		//Page config
		const	rowsPerPage = 5;
		const	startPage = page * rowsPerPage;
		const	visibleRows = filteredRows.slice(startPage, startPage + rowsPerPage);
		const	endPage = Math.min((page + 1) * rowsPerPage, filteredRows.length);
		const	exportName = "relatório";
		
		function	downloadPdf(rows: typeof filteredRows)
		{
			const	doc = new jsPDF({orientation: "landscape"});
			const	visibleKey = Object.keys(colums).filter(key => colums[key].isVisible);
			const	headers = visibleKey.map(key => colums[key].label);
			const	data = rows.map(row => 
				visibleKey.map(key => {
					if (key === "rent")
						return (row.rent.toLocaleString("pt-br", {
							style: "currency",
							currency: "BRL",
						}));
					return (row[key]);
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

		function	downloadCsv(rows: typeof filteredRows)
		{
			const	visibleKey = Object.keys(colums).filter(key => colums[key].isVisible);
			const	header = visibleKey.map(key => colums[key].label || key).join(", ");
			const	body = rows.map(row => 
				visibleKey.map(key => {
					if (key === "rent")
					{
						const	value  = row.rent.toLocaleString("pt-br", {
							style: "currency",
							currency: "BRL",
						});
						return (`"${value}"`);
					}
					const	value = row[key];
					if (typeof value === "string" && value.includes(","))
						return (`"${value}"`);
					return (value);
				}).join(",")
			).join("\n");

			const	csvContent = `${header}\n${body}`;
			const	blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
			const	url = URL.createObjectURL(blob);
			const	link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute("download", exportName + ".csv");
			link.click();
		}

		function	drawButtons()
		{
			const	buttons = [
				{label: "Filtros", icon: Funnel},
				{label: "Colunas", icon: Columns2},
				{label: "Exportar", icon: Download},
			];
			const	buttonHover = "bg-white hover:bg-blue-200"
			const	popoverBox = "w-80 flex flex-col gap-4 border border-b border-slate-400 overflow-y-auto max-h-70"
			const	FilterIcon = buttons[0].icon;
			const	ColumnIcon = buttons[1].icon;
			const	ExportIcon = buttons[2].icon;
		
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
							{Object.entries(colums).map(([key, col]) => {
								const	isActive = key === activeFilter;
								const	activeClass = isActive ? "bg-blue-200" : "bg-white";

								return (
									<Button
										{...buttonProps}
										className={`${buttonHover} ${activeClass}`}
										key={key}
										onClick={() => {
											setActiveFilter(key);
											// updateFilter(key);
										}}
									>
										{col.label}
									</Button>
								);	
							})}
						</PopoverContent>
					</Popover>

					<div className="flex gap-4 ml-auto">
						{/* {buttons.slice(1).map(({label, icon: Icon}) => {
							return (
								<Button {...buttonProps}>
									<Icon />
									{label}
								</Button>
							);
						})} */}
						<Popover>
							<PopoverTrigger asChild>
								<Button {...buttonProps} className={buttonHover}>
									<ColumnIcon />
									Colunas
								</Button>
							</PopoverTrigger>
							<PopoverContent className={popoverBox}>
								{Object.entries(colums).map(([key, col]) => {
									return (
										<div key={key} className="flex gap-2">
											<Checkbox
												id={`checkbox-${key}`} 
												checked={col.isVisible}
												onCheckedChange={(checked) =>
													setColums((prev) => ({
														...prev,
														[key]: {...prev[key], isVisible: !!checked}
													}))
												}
											/>
											<div className={`w-5 h-5 flex justify-center items-center border border-gray-400
														${col.isVisible ? "bg-blue-600 border-blue-300" : "bg-white"}`}>
												{col.isVisible && <Check className="w-4 h-4 text-white"/>}
											</div>
											<label htmlFor={`checkbox-${key}`} className="flex justify-start items-start cursor-pointer select-none gap-2">
												{col.label}
											</label>
										</div>
									);
								})

								}
							</PopoverContent>
						</Popover>
						<Popover>
							<PopoverTrigger asChild>
								<Button {...buttonProps}
									className={buttonHover}
									>
									<ExportIcon/>
									{buttons[2].label}
								</Button>
							</PopoverTrigger>
							<PopoverContent className={popoverBox}>
									<Button {...buttonProps} onClick={() => downloadPdf(filteredRows)} className={buttonHover}>
										<FileText />
										Exportar como PDF
									</Button>
									<Button {...buttonProps} onClick={() => downloadCsv(filteredRows)} className={buttonHover}>
										<File />
										Exportar como CSV
									</Button>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			);
		}

		function	drawResults(dataRows)
		{
			const	visibleColums =Object.entries(colums).filter(
				([_,col]) => col.isVisible
			);

			function	pagination()
			{
				const	nextPage = page + 1;
				const	prevPage = page - 1;
				const	pageNumbers = [prevPage, page, nextPage];

				return (
					<div className="flex justify-end items-end text-black">
						<Button {...buttonProps} onClick={() => {
							if (prevPage >= 0)
								setPage(prevPage);
							}}>
							<ChevronLeft/>
						</Button>
						{pageNumbers.filter((p) => p >= 0 && p < dataRows.length / 5).map((p) => {
							const	isActive = page === p;

							return (
								<Button className={`flex justify-end items-end ${isActive ? " font-bold text-black": "text-slate-400"}`} key={p} {...buttonProps} onClick={() => {setPage(p)}}>
									{p + 1}
								</Button>
							);
						})}
						<Button  {...buttonProps} onClick={() => {
							if (nextPage < dataRows.length/5)
								setPage(nextPage);
							}}>
							<ChevronRight/>
						</Button>
					</div>
				);
			}

			return (
				<div className="flex flex-col border border-gray-200 rounded-md bg-white w-full h-full">
					<table className="table-auto w-full border-collapse">
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
							{visibleRows.map((row, i) => (
							<tr key={i} className="border-b border-gray-200">
								{visibleColums.map(([key]) => (
								<td
									key={key}
									className="px-4 py-2 truncate max-w-[200px]"
									title={String(row[key as keyof typeof row])}
								>
									{
									key === "rent"
									? new Intl.NumberFormat("pt-BR", {
										style: "currency",
										currency: "BRL",
										}).format(row[key as keyof typeof row] as number)
									: String(row[key as keyof typeof row])
									}
								</td>
								))}
							</tr>
							))}
						</tbody>
						</table>
					{/*	botao para atualizar o estado das paginas*/}
					<div className="flex border-b border-gray-200">
						<p className="p-4 text-slate-400">
							Mostrando {startPage + 1} a {endPage} de {filteredRows.length} resultados
						</p>
						<div className="ml-auto p-4">
							{pagination()}
						</div>
					</div>
				</div>
			);
		}

		function	removeFilter(toRemove: string)
		{
			setFilter(prev => ({
				...prev,
				[toRemove]: "",
			}))
			setPage(0);
		}
		return (
			<div className="flex flex-col gap-4">
				<div className="flex bg-white w-full gap-4 p-4 border border-b rounded-md">
					<Input
						className="w-64"
						value={inputValue}
						placeholder="Buscar estudante..."
						onChange={e => {
							setFilter(prev => ({
								...prev,
								[activeFilter] : e.target.value
							}));
						}}
						onKeyDown={k => {
							if (k.key === "Enter")
							{
								const	input = k.target as HTMLInputElement;
								updateFilter(input.value);
							}
						}}
					/>
					{drawButtons()}
				</div>
				<div
					className="flex items-start gap-2"
				>
					{Object.entries(filter)
							.filter(([_, value]) => value.trim() !== "")
							.map(([key, value]) => (
								<span key={key} className="flex font-medium bg-slate-200 px-4 py-1 gap-4 border border-gray-200 rounded-md">
									{colums[key]?.label || key}:{value}
									<button
										className="h-5 w-5"
										onClick={() => removeFilter(key)}
									>
										<X />
									</button>
								</span>
							))
					}
				</div>
				{drawResults(filteredRows)}
			</div>
		);
	}

	return (
		<div className={background}>
			<DrawStatus
				activeLabel={activeLabel}
				setActiveLabel={setActiveLabel}
				filteredRows={filteredRows}
			/>
			{searchBar(dataRows)}
		</div>
	);
}
