export function	DrawTotals(props)
{
	const	background: string = "flex flex-col flex-1 flex-wrap bg-white rounded-md p-4 gap-4 border border-b border-gray-200 flex-shrink-0";
	return (
		<div className="flex flex-wrap gap-4 w-full">
			{props.status.map(({label, value}) => {
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