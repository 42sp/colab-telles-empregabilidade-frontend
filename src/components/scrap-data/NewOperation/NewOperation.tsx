import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/formInput";
import { Calendar, Clock, Tag, Repeat, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { useOperationFormContext } from "@/contexts/useOperationFormContext";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TbTargetArrow } from "react-icons/tb";

type NewOperationProps = {
	isSubmitting: boolean;
};

const availableConditions = [
	{ value: "working", label: "Trabalhando", options: ["Sim", "Não"] },
	{
		value: "currentState",
		label: "Estado",
		options: [
			"Acre",
			"Alagoas",
			"Amazonas",
			"Amapá",
			"Bahia",
			"Ceará",
			"Distrito Federal",
			"Espírito Santo",
			"Goiás",
			"Maranhão",
			"Minas Gerais",
			"Mato Grosso do Sul",
			"Mato Grosso",
			"Pará",
			"Paraíba",
			"Pernambuco",
			"Piauí",
			"Paraná",
			"Rio de Janeiro",
			"Rio Grande do Norte",
			"Rondônia",
			"Roraima",
			"Rio Grande do Sul",
			"Santa Catarina",
			"Sergipe",
			"São Paulo",
			"Tocantins",
		],
	},
	{ value: "gender", label: "Sexo", options: ["Masculino", "Feminino"] },
	{
		value: "raceEthnicity",
		label: "Etnicidade",
		options: ["Branca", "Parda", "Preta", "Amarela"],
	},
	{ value: "hasDisability", label: "PcD", options: ["Sim", "Não"] },
];

export function NewOperation({ isSubmitting }: NewOperationProps) {
	const form = useOperationFormContext();
	const isRecurring = form.watch("isRecurring");
	const conditions = form.watch("target_conditions") || [];

	function addCondition() {
		const newConditions = [...conditions, { field: "", value: "" }];
		form.setValue("target_conditions", newConditions);
	}

	function updateCondition(
		index: number,
		key: "field" | "value",
		value: string
	) {
		const updated = [...conditions];
		updated[index][key] = value;
		form.setValue("target_conditions", updated);
	}

	function getAvailableConditions(currentIndex: number) {
		const selectedFields = conditions
			.filter((_, index) => index !== currentIndex) // Ignora a condição atual
			.map(cond => cond.field)
			.filter(field => field !== ""); // Ignora campos vazios
		return availableConditions.filter(
			condition => !selectedFields.includes(condition.value)
		);
	}

	return (
		<Card role="form" aria-labelledby="new-operation-title">
			<CardHeader>
				<CardTitle
					id="new-operation-title"
					className="text-2xl font-bold flex items-center gap-2"
				>
					Agendar nova operação
					{/* Ícone com tooltip */}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="cursor-pointer text-muted-foreground">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M12 2C6.48 2 2 6.48 2 12s4.48 10 
                       10 10 10-4.48 10-10S17.52 2 12 
                       2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 
                       8-8 8 3.59 8 8-3.59 8-8 
                       8zm-1-5h2v2h-2v-2zm1-9c-1.66 
                       0-3 1.34-3 3h2a1 1 0 0 
                       1 2 0c0 .55-.45 1-1 
                       1s-1 .45-1 1v2h2v-1.17c1.16-.41 
                       2-1.52 2-2.83 0-1.66-1.34-3-3-3z"
										/>
									</svg>
								</span>
							</TooltipTrigger>
							<TooltipContent side="right" className="max-w-xs">
								<p>
									Este formulário permite agendar uma nova operação de scraping para atualizar os dados dos alunos selecionados.
									<br />
									<br />
									➝ Defina nome, data e hora.
									<br />➝ Adicione condições para os alvos.
									<br />
									<br /> Exemplo:
									<br /> • Trabalhando: Sim
									<br /> • PcD: Sim
									<br />
									<br /> Selecionaria todos os alunos que atualmente estão trabalhando e são PcD de acordo com o estado atual do banco.
									<br />
									<br /> Observação: Não selecionar condições fará uma busca total, incluindo todos os alunos atualmente registrados.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</CardTitle>

				<p
					className="text-sm text-muted-foreground"
					id="new-operation-description"
				>
					Preencha os campos para agendar uma nova operação de scraping
				</p>
			</CardHeader>

			<CardContent>
				<div
					className="flex flex-col gap-8"
					aria-describedby="new-operation-description"
				>
					<FormInput
						name="name"
						label="Nome"
						placeholder="Nome da operação"
						iconPrepend={<Tag />}
						wrapperClassName="w-full"
						inputClassName="w-full"
					/>

					<div className="flex flex-wrap gap-5">
						<FormInput
							name="initial_date"
							label="Data"
							type="date"
							iconPrepend={<Calendar />}
							wrapperClassName="flex-1 min-w-[150px]"
							inputClassName="w-full"
						/>
						<FormInput
							name="initial_time"
							label="Hora"
							type="time"
							iconPrepend={<Clock />}
							wrapperClassName="flex-1 min-w-[150px]"
							inputClassName="w-full"
						/>
					</div>

					{/* Alvo */}
					<div>
						<Label className="font-semibold flex items-center gap-2 mb-4">
							<TbTargetArrow size={18} /> Alvo
						</Label>

						<div className="flex flex-col gap-4">
							{conditions.map((cond: any, index: number) => {
								const selectedField = availableConditions.find(
									c => c.value === cond.field
								);
								const availableOptions = getAvailableConditions(index); // Filtra condições disponíveis
								return (
									<div key={index} className="flex gap-3 items-center">
										<Select
											value={cond.field}
											onValueChange={val =>
												updateCondition(index, "field", val)
											}
										>
											<SelectTrigger className="w-[200px]">
												<SelectValue placeholder="Condição" />
											</SelectTrigger>
											<SelectContent>
												{availableOptions.map(opt => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<Select
											value={cond.value}
											onValueChange={val =>
												updateCondition(index, "value", val)
											}
											disabled={!selectedField}
										>
											<SelectTrigger className="w-[200px]">
												<SelectValue placeholder="Valor" />
											</SelectTrigger>
											<SelectContent>
												{selectedField?.options.map(opt => (
													<SelectItem key={opt} value={opt}>
														{opt}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								);
							})}

							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											type="button"
											variant="outline"
											size="icon"
											className="mt-2"
											onClick={addCondition}
											disabled={conditions.length >= availableConditions.length} // Desativa o botão se todas as condições já foram usadas
										>
											<Plus size={18} />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Adicionar condição</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-[42px] min-w-[130px] cursor-pointer"
							aria-label="Agendar nova operação"
						>
							{isSubmitting ? "Enviando..." : "Agendar"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
