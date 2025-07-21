import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/formInput";
import { Calendar, Clock, Tag } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function NewOperation() {
	const { handleSubmit } = useFormContext();

	return (
		<Card role="form" aria-labelledby="new-operation-title">
			<CardHeader>
				<CardTitle id="new-operation-title" className="text-2xl font-bold">
					Agendar nova operação
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
					{/* Linha 1: Data e Hora */}
					<div className="flex flex-wrap justify-between gap-5">
						<FormInput
							name="date"
							label="Data"
							type="date"
							placeholder="yyyy / mm / dd"
							iconPrepend={<Calendar />}
							wrapperClassName="flex-1 min-w-[200px] max-w-[550px]"
							inputClassName="w-full"
						/>
						<FormInput
							name="time"
							label="Hora"
							type="time"
							iconPrepend={<Clock />}
							wrapperClassName="flex-1 min-w-[200px] max-w-[550px]"
							inputClassName="w-full"
						/>
					</div>

					{/* Linha 2: Nome */}
					<FormInput
						name="name"
						label="Nome"
						placeholder="Nome da operação"
						iconPrepend={<Tag />}
						wrapperClassName="w-full "
						inputClassName="w-full"
					/>

					{/* Linha 3: Botão alinhado à direita */}
					<div className="flex justify-end">
						<Button
							type="submit"
							className="h-[42px] min-w-[130px]"
							aria-label="Agendar nova operação"
						>
							Agendar
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
