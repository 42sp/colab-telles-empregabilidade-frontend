import type { Dispatch, SetStateAction } from "react";
import type {
	ButtonType,
	Data,
	Stats,
	StatusType,
} from "../../../pages/home/types";
import { DrawStatusButton } from "./DrawStatusButton";
import { DrawTotals } from "./DrawTotals";

interface DrawStatusProps {
	activeLabel: string;
	setActiveLabel: Dispatch<SetStateAction<string>>;
	filteredRows: Data[];
	dataRows: Data[];
	stats: Stats;
}

export function DrawStatus(props: DrawStatusProps) {
	const buttons: ButtonType[] = [
		{ label: "Todos" },
		{ label: "Ativos" },
		{ label: "Inativos" },
	];

	const status: StatusType[] = [
		{ label: "Total de estudantes", value: props.stats.total },
		{
			label: "Trabalhando",
			value: props.stats.working,
		},
		{
			label: "Não Trabalhando",
			value: props.stats.notWorking,
		},
		{ label: "Salário Médio", value: props.stats.avgCompensation },
	];

	return (
		<div className="flex flex-col flex-wrap gap-4 w-full">
			<DrawStatusButton
				buttons={buttons}
				activeLabel={props.activeLabel}
				setActiveLabel={props.setActiveLabel}
				filteredRows={props.filteredRows}
			/>
			<DrawTotals status={status} />
		</div>
	);
}
