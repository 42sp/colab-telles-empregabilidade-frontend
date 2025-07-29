import type { StatusType } from "../types";

interface DrawTotalsProps {
	status: StatusType[];
}

export function DrawTotals({ status }: DrawTotalsProps) {
	const background: string =
		" flex flex-col flex-1 w-full bg-white rounded-md p-4 gap-4 border border-b border-gray-200 flex-shrink-0";

	return (
		<div className="flex flex-wrap gap-4">
			{status.map(({ label, value }) => {
				const displayValue =
					label === "Salário Médio"
						? value.toLocaleString("pt-BR", {
								style: "currency",
								currency: "BRL",
							})
						: value;

				return (
					<div key={label} className={background}>
						<h2 className="text-xl text-zinc-500">{label}</h2>
						<h1 className="text-3xl font-bold whitespace-nowrap">
							{displayValue}
						</h1>
					</div>
				);
			})}
		</div>
	);
}
