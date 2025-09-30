import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { NewOperation } from "./NewOperation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useOperationsActions } from "@/contexts/ScrapOperationsContext";
import {
	OperationFormProvider,
	operationFormSchema,
	type OperationFormData,
} from "@/contexts/useOperationFormContext";
import type { Operation } from "@/types/operations";


export function NewOperationForm() {
	const { user } = useAuth();
	const form = useForm<OperationFormData>({
		resolver: zodResolver(operationFormSchema),
		defaultValues: {
			name: "",
			initial_date: "",
			initial_time: "",
			isRecurring: false,
			repeat_days: "",
			repeat_time: "",
			target_conditions: [],
		},
	});

	const { createOperation } = useOperationsActions();
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function onSubmit(data: OperationFormData) {
		if (!user) {
			toast.error("Usuário não está logado");
			return;
		}

		setIsSubmitting(true);
		try {
			const now = new Date().toISOString();

			const payload: Partial<Operation> = {
				name: data.name,
				type: "LinkedIn",
				status: "Agendado",
				user_tag: user.email,
				created_by: user.email,
				created_at: now,
				scheduled_date: data.initial_date,
				scheduled_time: data.initial_time,
				repeat_days:
					data.isRecurring && data.repeat_days ? data.repeat_days : undefined,
				repeat_time:
					data.isRecurring && data.repeat_time ? data.repeat_time : undefined,
				deleted: false,
				target_conditions:
					data.target_conditions && data.target_conditions.length > 0
						? JSON.stringify(data.target_conditions.map(c => ({ field: c.field, value: c.value })))
						: undefined,
			};

			const created = await createOperation(payload);
			if (created) {
				form.reset({
					name: "",
					initial_date: "",
					initial_time: "",
					isRecurring: false,
					repeat_days: "",
					repeat_time: "",
					target_conditions: [],
				});
			}
		} catch (err) {
			console.error("Erro ao criar operação:", err);
			toast.error("Erro ao agendar operação");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<OperationFormProvider value={form}>
					<NewOperation isSubmitting={isSubmitting} />
				</OperationFormProvider>
			</form>
		</Form>
	);
}
