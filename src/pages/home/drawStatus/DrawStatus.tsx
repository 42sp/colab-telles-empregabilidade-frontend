import { DrawStatusButton } from "./DrawStatusButton";
import { DrawTotals } from "./DrawTotals";

type StatusType = {
	label: string;
	value: number;
};

type ButtonType = {
	label: string;
};

function getAverange(row): number {
	const myRent = row
		.map(row => row.rent)
		.filter(rent => typeof rent === "number");

	if (myRent.length === 0) return 0;

	const sum: number = myRent.reduce(
		(total: number, now: number) => total + now,
		0
	);

	return sum / myRent.length;
}

export function DrawStatus(props) {
	const buttons: ButtonType[] = [
		{ label: "Todos" },
		{ label: "Ativos" },
		{ label: "Inativos" },
	];

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
