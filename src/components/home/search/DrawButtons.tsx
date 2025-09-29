import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuCheckboxItem,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Funnel, Columns2, Download, File, FileText } from "lucide-react";
import type { ColumnKey, StateBundle } from "../../../pages/home/types";
import { columnGroups } from "../../../pages/home/columnGroups";
import { useServices } from "@/hooks/useServices";
import { useBuildQuery } from "../utils/buildQuery";
import { downloadPdf } from "../utils/downloadPdf";
import { downloadCsv } from "../utils/downloadCsv";
import "./style.css";

export function DrawButtons(props: StateBundle) {
	const exportName = "relatório";
	const $service = useServices();
	const buildQuery = useBuildQuery(props.activeLabel, props.filter);

	return (
		<div className="flex flex-wrap w-full justify-between gap-2">
			<div className="drawer-buttons-container">
				{/* ---------------- Filtros ---------------- */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="drawer-buttons cursor-pointer text-base"
						>
							<Funnel className="mr-2 h-4 w-4" /> Filtros
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" side="bottom" align="start">
						<DropdownMenuLabel>Filtros Disponíveis</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{Object.entries(props.colums).map(([key, col]) => (
							<DropdownMenuItem
								key={key}
								className={`cursor-pointer ${key === props.activeFilter ? "bg-gray-300" : ""} hover:bg-gray-200 focus:bg-gray-200`}
								onClick={() => props.setActiveFilter(key as ColumnKey)}
							>
								{col.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* ---------------- Colunas ---------------- */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="drawer-buttons cursor-pointer text-base"
						>
							<Columns2 className="mr-2 h-4 w-4" /> Colunas
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" side="bottom" align="start">
						<DropdownMenuLabel>Exibir/Ocultar Colunas</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{Object.entries(columnGroups).map(([group, items]) => (
							<DropdownMenuSub key={group}>
								<DropdownMenuSubTrigger className="hover:bg-gray-200 focus:bg-gray-200">
									{group}
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="w-64">
									{items.map(item => {
										if (typeof item === "string") {
											const col = props.colums[item];
											if (!col) return null;
											return (
												<DropdownMenuCheckboxItem
													key={item}
													checked={col.isVisible}
													className="hover:bg-gray-200 focus:bg-gray-200"
													onCheckedChange={checked =>
														props.setColums(prev => ({
															...prev,
															[item]: { ...prev[item], isVisible: !!checked },
														}))
													}
												>
													{col.label}
												</DropdownMenuCheckboxItem>
											);
										} else {
											return Object.entries(item).map(([subLabel, subKeys]) => (
												<DropdownMenuSub key={subLabel}>
													<DropdownMenuSubTrigger>
														{subLabel}
													</DropdownMenuSubTrigger>
													<DropdownMenuSubContent className="w-64">
														{subKeys.map(subKey => {
															const col = props.colums[subKey];
															if (!col) return null;
															return (
																<DropdownMenuCheckboxItem
																	key={subKey}
																	checked={col.isVisible}
																	className="hover:bg-gray-200 focus:bg-gray-200"
																	onCheckedChange={checked =>
																		props.setColums(prev => ({
																			...prev,
																			[subKey]: {
																				...prev[subKey],
																				isVisible: !!checked,
																			},
																		}))
																	}
																>
																	{col.label}
																</DropdownMenuCheckboxItem>
															);
														})}
													</DropdownMenuSubContent>
												</DropdownMenuSub>
											));
										}
									})}
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* ---------------- Exportar ---------------- */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="drawer-buttons cursor-pointer text-base"
					>
						<Download className="mr-2 h-4 w-4" /> Exportar
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" side="bottom" align="start">
					<DropdownMenuLabel>Exportar Dados</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							downloadPdf(buildQuery(0), exportName, props.colums, $service);
						}}
						className="hover:bg-gray-200 focus:bg-gray-200"
					>
						<FileText className="mr-2 h-4 w-4" /> Exportar como PDF
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							downloadCsv(buildQuery(0), exportName, props.colums, $service)
						}
						className="hover:bg-gray-200 focus:bg-gray-200"
					>
						<File className="mr-2 h-4 w-4" /> Exportar como CSV
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
