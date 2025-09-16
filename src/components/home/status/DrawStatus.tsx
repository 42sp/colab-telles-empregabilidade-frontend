import type { Dispatch, SetStateAction } from "react";
import type { ButtonType, Stats, StatusType } from "../../../pages/home/types";
import { DrawStatusButton } from "./DrawStatusButton";
import { DrawTotals } from "./DrawTotals";
import type { StudentsParameters } from "@/types/requests";

interface DrawStatusProps {
	activeLabel: string;
	setActiveLabel: Dispatch<SetStateAction<string>>;
	filteredRows: StudentsParameters[];
	stats: Stats;
}

export function DrawStatus(props: DrawStatusProps) {
	const buttons: ButtonType[] = [
		{ label: "Todos" },
		{ label: "Ativos" },
		{ label: "Inativos" },
		{ label: "Formados" },
	];

	const status: StatusType[] = [
		{ label: "Total de estudantes", value: props.stats?.total ?? 0},
		{
			label: "Trabalhando",
			value: props.stats?.working ?? 0,
		},
		{
			label: "Não Trabalhando",
			value: props.stats?.notWorking ?? 0,
		},
		{ label: "Salário Médio", value: props.stats?.avgCompensation ?? 0},
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
