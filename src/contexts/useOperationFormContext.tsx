import { createContext, useContext } from "react";
import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";

export const operationFormSchema = z
  .object({
    name: z.string().min(1, "Nome da operação obrigatório"),
    initial_date: z.string().min(1, "Data obrigatória"),
    initial_time: z.string().min(1, "Hora obrigatória"),
    isRecurring: z.boolean(),
    repeat_days: z.string().optional(),
    repeat_time: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.isRecurring) {
      // Campos obrigatórios para recorrência
      if (!val.repeat_days || val.repeat_days.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione os dias da recorrência",
          path: ["repeat_days"],
        });
      }

      if (!val.repeat_time || val.repeat_time.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione o horário da recorrência",
          path: ["repeat_time"],
        });
      }
    } else {
      // Limpa automaticamente os valores se não for recorrente
      val.repeat_days = "";
      val.repeat_time = "";
    }
  });

export type OperationFormData = z.infer<typeof operationFormSchema>;

const OperationFormContext =
  createContext<UseFormReturn<OperationFormData> | null>(null);

export const useOperationFormContext = () => {
  const ctx = useContext(OperationFormContext);
  if (!ctx)
    throw new Error("useOperationFormContext must be usado dentro de um Provider");
  return ctx;
};

export const OperationFormProvider = OperationFormContext.Provider;
