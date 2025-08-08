import { createContext, useContext } from "react";
import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";

export const operationFormSchema = z
	.object({
		name: z.string().min(1, "Nome da operação obrigatório"),
		initial_date: z.string().min(1, "Data obrigatória"),
		initial_time: z.string().min(1, "Hora obrigatória"),
		isRecurring: z.boolean(),
		repeat_days: z
			.string()
			.optional()
			.refine(val => val === undefined || val.trim() !== "", {
				message: "Dias de repetição obrigatórios",
			}),
		repeat_time: z.string().optional(),
	})
	.superRefine((val, ctx) => {
		if (val.isRecurring) {
			if (!val.repeat_days || !val.repeat_time) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Campos de recorrência são obrigatórios",
					path: ["repeat_days"],
				});
			}
		} else {
			if (val.repeat_days || val.repeat_time) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Remova os campos de recorrência se não for recorrente",
					path: ["repeat_days"],
				});
			}
		}
	});

export type OperationFormData = z.infer<typeof operationFormSchema>;

const OperationFormContext =
	createContext<UseFormReturn<OperationFormData> | null>(null);

export const useOperationFormContext = () => {
	const ctx = useContext(OperationFormContext);
	if (!ctx)
		throw new Error("useOperationFormContext must be used inside a Provider");
	return ctx;
};

export const OperationFormProvider = OperationFormContext.Provider;
