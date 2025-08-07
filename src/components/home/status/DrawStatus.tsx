import type { Dispatch, SetStateAction } from "react";
import { dataRows } from "../../../pages/home/types";
import type { ButtonType, Data, StatusType } from "../../../pages/home/types";
import { DrawStatusButton } from "./DrawStatusButton";
import { DrawTotals } from "./DrawTotals";

interface DrawStatusProps {
	activeLabel: string;
	setActiveLabel: Dispatch<SetStateAction<string>>;
	filteredRows: Data[];
}

export function DrawStatus(props: DrawStatusProps) {
	const buttons: ButtonType[] = [
		{ label: "Todos" },
		{ label: "Ativos" },
		{ label: "Inativos" },
	];

	function getAverange(row: typeof dataRows): number {
		const myRent = row
			.map(row => row.rent)
			.filter(rent => typeof rent === "number");

		if (myRent.length === 0) return 0;

		const sum = myRent.reduce((total, now) => total + now, 0);

		return sum / myRent.length;
	}

	const status: StatusType[] = [
		{ label: "Total de estudantes", value: props.filteredRows.length },
		{
			label: "Trabalhando",
			value: props.filteredRows.filter(row => row.isWorkin == "Sim").length,
		},
		{
			label: "Não Trabalhando",
			value: props.filteredRows.filter(row => row.isWorkin == "Não").length,
		},
		{ label: "Salário Médio", value: getAverange(props.filteredRows) },
	];

	return (
		<div className="flex flex-col flex-wrap gap-4 w-full">
			<DrawStatusButton
				buttons={buttons}
				activeLabel={props.activeLabel}
				setActiveLabel={props.setActiveLabel}
			/>
			<DrawTotals status={status} />
		</div>
	);
}