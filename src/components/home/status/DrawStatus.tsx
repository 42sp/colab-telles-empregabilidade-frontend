import type {
	ButtonType,
	StateBundle,
	StatusType,
} from "../../../pages/home/types";
import { DrawStatusButton } from "./DrawStatusButton";
import { DrawTotals } from "./DrawTotals";

export function DrawStatus(props: StateBundle) {
	const buttons: ButtonType[] = [
		{ label: "Todos" },
		{ label: "Ativos" },
		{ label: "Inativos" },
		{ label: "Formados" },
	];

	const status: StatusType[] = [
		{ label: "Total de estudantes", value: props.stats?.total ?? 0 },
		{
			label: "Trabalhando",
			value: props.stats?.working ?? 0,
		},
		{
			label: "Não Trabalhando",
			value: props.stats?.notWorking ?? 0,
		},
		{ label: "Salário Médio", value: props.stats?.avgCompensation ?? 0 },
	];

	return (
		<div
			style={{ maxHeight: "200px" }}
			className="flex flex-col flex-wrap gap-4 flex-1"
		>
			<DrawStatusButton buttons={buttons} states={props} />
			<DrawTotals status={status} />
		</div>
	);
}
