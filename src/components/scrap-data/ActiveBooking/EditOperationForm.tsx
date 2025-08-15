import { useOperationFormContext } from "@/contexts/useOperationFormContext";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/ui/formInput";
import { Calendar, Clock, Repeat, Tag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type EditOperationFormProps = {
	isSubmitting: boolean;
};

export function EditOperationForm({ isSubmitting }: EditOperationFormProps) {
	const form = useOperationFormContext();
	const isRecurring = form.watch("isRecurring");

	// Função para desabilitar inputs (pode usar prop disabled, ou setar readOnly para inputs controlados)
	const recurrenceClass = isRecurring
		? "opacity-100 pointer-events-auto"
		: "opacity-50 pointer-events-none select-none";

	return (
		<Card role="form" aria-labelledby="edit-operation-title">
			<CardContent>
				<div
					className="flex flex-col gap-8"
					aria-describedby="edit-operation-description"
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

					<div>
						<div className="flex items-center gap-4 mb-6">
							<Switch
								id="recorrente"
								checked={isRecurring}
								onCheckedChange={checked =>
									form.setValue("isRecurring", checked)
								}
							/>
							<Label
								htmlFor="recorrente"
								className="font-semibold flex items-center gap-2"
							>
								<Repeat size={18} />
								Recorrência
							</Label>
						</div>

						{/* Campos sempre renderizados, só estilizados e desabilitados conforme estado */}
						<div className={recurrenceClass}>
							<div className="flex flex-wrap gap-5">
								<FormInput
									name="repeat_days"
									label="A cada quantos dias?"
									type="number"
									min={1}
									placeholder="Ex: 7"
									wrapperClassName="flex-1 min-w-[150px]"
									inputClassName="w-full"
									disabled={!isRecurring}
								/>
								<FormInput
									name="repeat_time"
									label="Hora da recorrência"
									type="time"
									iconPrepend={<Clock />}
									wrapperClassName="flex-1 min-w-[150px]"
									inputClassName="w-full"
									disabled={!isRecurring}
								/>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-[42px] min-w-[130px]"
							aria-label="Salvar edição da operação"
						>
							{isSubmitting ? "Salvando..." : "Salvar"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
