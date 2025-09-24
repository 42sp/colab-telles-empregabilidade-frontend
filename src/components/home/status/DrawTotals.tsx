import type { StatusType } from "@/pages/home/types";
import { motion } from "framer-motion";

interface DrawTotalsProps {
	status: StatusType[];
}

export function DrawTotals({ status }: DrawTotalsProps) {
	const background: string =
		" flex flex-col flex-1 w-full bg-white rounded-md p-4 gap-4 border border-b border-gray-200 flex-shrink-0";

	return (
		<div className="flex flex-wrap gap-4 flex-1">
			{status.map(({ label, value }) => {
				const displayValue =
					label === "Salário Médio"
						? (value ?? 0).toLocaleString("pt-BR", {
								style: "currency",
								currency: "BRL",
							})
						: (value ?? 0);

				return (
					<div key={label} className={background}>
						<h2 className="text-xl text-zinc-500">{label}</h2>
						<motion.h1
							key={displayValue}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.3 }}
							className="text-3xl font-bold whitespace-nowrap"
						>
							{displayValue}
						</motion.h1>
					</div>
				);
			})}
		</div>
	);
}
