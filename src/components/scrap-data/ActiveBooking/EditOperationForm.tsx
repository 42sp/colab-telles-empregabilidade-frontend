import { useOperationFormContext } from "@/contexts/useOperationFormContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/formInput";
import { Calendar, Clock, Repeat, Tag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { scrapOperationsService } from "@/services/scrapOperationsService";
import type { Operation } from "@/types/operations"

type EditOperationFormProps = {
	isSubmitting: boolean;
	operationId: number | string; // id da operação sendo editada
};

export function EditOperationForm({
	isSubmitting,
	operationId,
}: EditOperationFormProps) {
	const form = useOperationFormContext();
	const { user } = useAuth(); // pegar usuário logado

	const isRecurring = form.watch("isRecurring");

	const recurrenceClass = isRecurring
		? "opacity-100 pointer-events-auto"
		: "opacity-50 pointer-events-none select-none";

	const created_by = form.getValues("created_by");
	const created_at = form.getValues("created_at");
	const last_edited_by = form.getValues("last_edited_by");
	const last_edited_at = form.getValues("last_edited_at");

	async function handleSubmit(data: Partial<Operation>) {
		form.setValue("last_edited_by", user?.email || "unknown");
		form.setValue("last_edited_at", new Date().toISOString());

		try {
			await scrapOperationsService.patch(
				operationId,
				{
					...data,
					last_edited_by: form.getValues("last_edited_by"),
					last_edited_at: form.getValues("last_edited_at"),
				},
				{ source: "edit" }
			);

			form.reset(data);
		} catch (err) {
			console.error("Erro ao atualizar operação:", err);
			toast.error("Erro ao atualizar operação");
		}
	}

	return (
		<Card
			role="form"
			aria-labelledby="edit-operation-title"
			onSubmit={form.handleSubmit(handleSubmit)}
		>
			<CardHeader>
				<CardTitle id="edit-operation-title" className="text-2xl font-bold">
					Editar Operação
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Modifique os campos desejados e salve a operação
				</p>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-8">
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
								<Repeat size={18} /> Recorrência
							</Label>
						</div>

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

					{/* Seção de auditoria */}
					<div className="p-4 border rounded-md bg-gray-50 text-sm text-gray-700 flex flex-col gap-1">
						{created_by && (
							<span>
								Criado por: <b>{created_by}</b> em {created_at || "-"}
							</span>
						)}
						{last_edited_by && (
							<span>
								Última edição: <b>{last_edited_by}</b> em{" "}
								{last_edited_at || "-"}
							</span>
						)}
					</div>

					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-[42px] min-w-[130px]"
						>
							{isSubmitting ? "Salvando..." : "Salvar"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
