import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Funnel, Columns2, Download, ChevronLeft, ChevronRight, Check, File, FileText, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@radix-ui/react-checkbox";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type	StatusType = {
	label: string,
	value: number,
};

type	ButtonType = {
	label: string,
};

function	drawTitle(title: string)
{
	let	background: string = "flex flex-wrap bg-white border border-b border-gray-300 px-4 py-4.5 p-4";
	let	font: string = "font-bold font-geist  text-black text-2xl";

	return (
		<div className={background}>
			<h1 className={font}>{title}</h1>
		</div>
	);
}
function	drawBody()
{
	//States
	const	[activeLabel, setActiveLabel] = useState("Todos");
	const	[page, setPage] = useState(0);
	const	[colums, setColums] = useState({
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
	const	[filter, setFilter] = useState(() => {
		const initialFilter = Object.fromEntries(Object.keys(colums).map(key => [key, ""]));

		return (initialFilter);
	});
	const	[activeFilter, setActiveFilter] = useState("name");

	//Other vaariables
	let	background: string = "flex flex-col flex-wrap bg-white border border-b border-gray-300 w-full min-h-screen p-4 gap-4";

	//DataBases - isso eh um template enquanto n temos os dados
	const dataRows = [
		{ name: "Ana Silva", email: "ana@email.com", celNumber: "(11) 91234-5678", gender: "Feminino", sector: "RH", orientation: "Heterossexual", race: "Parda", pcd: "Não", linkedinLink: "linkedin.com/in/ana", isWorkin: "Sim", rent: 3000, isStudying: true },
		{ name: "João Souza", email: "joao@email.com", celNumber: "(21) 99876-5432", gender: "Masculino", sector: "TI", orientation: "Homosexual", race: "Branco", pcd: "Sim", linkedinLink: "linkedin.com/in/joao", isWorkin: "Não", rent: 4000, isStudying: false },
		{ name: "Mariana Costa", email: "mariana@email.com", celNumber: "(31) 99911-2233", gender: "Feminino", sector: "Marketing", orientation: "Bissexual", race: "Negra", pcd: "Não", linkedinLink: "linkedin.com/in/mariana", isWorkin: "Sim", rent: 3500, isStudying: true },
		{ name: "Carlos Lima", email: "carlos@email.com", celNumber: "(85) 98888-7766", gender: "Masculino", sector: "Financeiro", orientation: "Heterossexual", race: "Pardo", pcd: "Não", linkedinLink: "linkedin.com/in/carlos", isWorkin: "Sim", rent: 5000, isStudying: false },
		{ name: "Beatriz Rocha", email: "beatriz@email.com", celNumber: "(51) 99123-4567", gender: "Feminino", sector: "Design", orientation: "Homossexual", race: "Branca", pcd: "Sim", linkedinLink: "linkedin.com/in/beatriz", isWorkin: "Não", rent: 2800, isStudying: true },
		{ name: "Rafael Gomes", email: "rafael@email.com", celNumber: "(19) 98765-4321", gender: "Masculino", sector: "TI", orientation: "Heterossexual", race: "Negro", pcd: "Não", linkedinLink: "linkedin.com/in/rafael", isWorkin: "Sim", rent: 6200, isStudying: false },
		{ name: "Luana Fernandes", email: "luana@email.com", celNumber: "(62) 98456-1234", gender: "Feminino", sector: "Jurídico", orientation: "Bissexual", race: "Indígena", pcd: "Sim", linkedinLink: "linkedin.com/in/luana", isWorkin: "Sim", rent: 4700, isStudying: true },
		{ name: "Pedro Henrique", email: "pedro@email.com", celNumber: "(27) 99654-7890", gender: "Masculino", sector: "Logística", orientation: "Heterossexual", race: "Branco", pcd: "Não", linkedinLink: "linkedin.com/in/pedro", isWorkin: "Não", rent: 3200, isStudying: false },
		{ name: "Camila Dias", email: "camila@email.com", celNumber: "(92) 99345-6789", gender: "Feminino", sector: "Engenharia", orientation: "Homossexual", race: "Amarela", pcd: "Não", linkedinLink: "linkedin.com/in/camila", isWorkin: "Sim", rent: 5500, isStudying: true },
		{ name: "Diego Martins", email: "diego@email.com", celNumber: "(14) 98712-3456", gender: "Masculino", sector: "Administração", orientation: "Heterossexual", race: "Pardo", pcd: "Sim", linkedinLink: "linkedin.com/in/diego", isWorkin: "Sim", rent: 3900, isStudying: false },
		{ name: "Isabela Andrade", email: "isabela@email.com", celNumber: "(61) 99123-9988", gender: "Feminino", sector: "Jurídico", orientation: "Bissexual", race: "Branca", pcd: "Não", linkedinLink: "linkedin.com/in/isabela", isWorkin: "Não", rent: 2700, isStudying: true },
		{ name: "Lucas Almeida", email: "lucas@email.com", celNumber: "(67) 98765-1010", gender: "Masculino", sector: "TI", orientation: "Heterossexual", race: "Pardo", pcd: "Não", linkedinLink: "linkedin.com/in/lucas", isWorkin: "Sim", rent: 6100, isStudying: false },
		{ name: "Fernanda Lopes", email: "fernanda@email.com", celNumber: "(84) 98877-1122", gender: "Feminino", sector: "Design", orientation: "Homossexual", race: "Negra", pcd: "Sim", linkedinLink: "linkedin.com/in/fernanda", isWorkin: "Sim", rent: 4600, isStudying: true },
		{ name: "Tiago Ribeiro", email: "tiago@email.com", celNumber: "(45) 99666-7788", gender: "Masculino", sector: "Engenharia", orientation: "Heterossexual", race: "Branco", pcd: "Não", linkedinLink: "linkedin.com/in/tiago", isWorkin: "Não", rent: 3800, isStudying: false },
		{ name: "Juliana Mendes", email: "juliana@email.com", celNumber: "(31) 98222-3344", gender: "Feminino", sector: "TI", orientation: "Bissexual", race: "Indígena", pcd: "Sim", linkedinLink: "linkedin.com/in/juliana", isWorkin: "Sim", rent: 5100, isStudying: true },
		{ name: "Felipe Costa", email: "felipe@email.com", celNumber: "(11) 98888-9999", gender: "Masculino", sector: "Financeiro", orientation: "Heterossexual", race: "Pardo", pcd: "Não", linkedinLink: "linkedin.com/in/felipe", isWorkin: "Sim", rent: 5300, isStudying: false },
		{ name: "Larissa Rocha", email: "larissa@email.com", celNumber: "(83) 99777-6655", gender: "Feminino", sector: "Marketing", orientation: "Homossexual", race: "Amarela", pcd: "Não", linkedinLink: "linkedin.com/in/larissa", isWorkin: "Não", rent: 2900, isStudying: true },
		{ name: "André Pinto", email: "andre@email.com", celNumber: "(47) 98654-3210", gender: "Masculino", sector: "Administração", orientation: "Heterossexual", race: "Negro", pcd: "Sim", linkedinLink: "linkedin.com/in/andre", isWorkin: "Sim", rent: 4100, isStudying: false },
		{ name: "Patrícia Silva", email: "patricia@email.com", celNumber: "(21) 98444-2233", gender: "Feminino", sector: "RH", orientation: "Bissexual", race: "Branca", pcd: "Não", linkedinLink: "linkedin.com/in/patricia", isWorkin: "Sim", rent: 3700, isStudying: true },
		{ name: "Bruno Oliveira", email: "bruno@email.com", celNumber: "(16) 98555-6677", gender: "Masculino", sector: "TI", orientation: "Homossexual", race: "Pardo", pcd: "Não", linkedinLink: "linkedin.com/in/bruno", isWorkin: "Sim", rent: 5800, isStudying: false },
	];

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
		const	matchStatus =
			activeLabel === "Todos"
				? true
				: activeLabel === "Ativos"
				? row.isStudying === true
				: row.isStudying === false;
		
		return (matches && matchStatus);
	});

	function	drawStatus(dataRows)
	{
		const	buttons: ButtonType[] = [
			{label: "Todos"},
			{label: "Ativos"},
			{label: "Inativos"},
		];

		function	getAverange(row: typeof dataRows): number
		{
			const	myRent = row.map(row => row.rent).filter(rent => typeof rent === "number");

			if (myRent.length === 0)
				return (0);

			const	sum = myRent.reduce((total, now) => total + now, 0);

			return (sum / myRent.length);
		}

		const	status: StatusType[] = [
			{label: "Total de estudantes", value: filteredRows.length},
			{label: "Trabalhando", value: filteredRows.filter((row) => row.isWorkin == "Sim").length},
			{label: "Não Trabalhando", value: filteredRows.filter((row) => row.isWorkin == "Não").length},
			{label: "Salário Médio", value: getAverange(filteredRows)},
		];

		function	drawStatusButton(buttons: ButtonType[])
		{
			const	buttonProps ={
				variant: null,
				size: "default",
			};

			return (
				<div className="flex">
					{buttons.map(({label}) => {
						const	isActive: boolean = activeLabel === label;
						const	textColour: string = isActive ? "text-black": "text-zinc-500";
						const	buttonStyle: string = `flex items-center gap-2 justify-start font-geist text-base px-4 py-2 ${textColour}`;

						return (
							<Button key={label} {...buttonProps} className={buttonStyle} onClick={() => {setActiveLabel(label)}}>
								{label}
							</Button>
						);
					})}
				</div>
			);
		}
		function	drawTotals(status: StatusType[])
		{
			const	background: string = "flex flex-col flex-1 flex-wrap bg-white rounded-md p-4 gap-4 border border-b border-gray-200 flex-shrink-0";
			return (
				<div className="flex flex-wrap gap-4 w-full">
					{status.map(({label, value}) => {
						const	displayValue = (label === "Salário Médio") ? value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"}) : value;

						return (
							<div key={label} className={background}>
								<h2 className="text-xl text-zinc-500">{label}</h2>
								<h1 className="w-full text-3xl font-bold whitespace-nowrap">{displayValue}</h1>
							</div>
						);
					})}
				</div>
			);
		}
		return (
			<div className="flex flex-col flex-wrap gap-4 w-full">
				{drawStatusButton(buttons)}
				{drawTotals(status)}
			</div>
		);
	}

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
		const	exportName = "estudantes";
		
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
										<div className="flex gap-2">
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
			{drawStatus(dataRows)}
			{searchBar(dataRows)}
		</div>
	);
}

export function	StudentsList()
{
	return (
		<div className="flex flex-col flex-wrap min-h-screen w-full">
			{drawTitle("Lista de estudantes")}
			{drawBody()}
		</div>
	);
}
