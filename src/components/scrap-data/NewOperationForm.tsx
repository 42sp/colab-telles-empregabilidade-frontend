import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { NewOperation } from "./NewOperation";
import { useState } from "react";
import { scrapService } from "@/services/api";
import { toast } from "react-hot-toast";
import type { Operation } from "@/types/operations";
import {
  OperationFormProvider,
  operationFormSchema,
  type OperationFormData,
} from "@/contexts/useOperationFormContext";

type NewOperationFormProps = {
  onOperationCreated: (op: Operation) => void;
};

export function NewOperationForm({ onOperationCreated }: NewOperationFormProps) {
  const form = useForm<OperationFormData>({
    resolver: zodResolver(operationFormSchema),
    defaultValues: {
      name: "",
      initial_date: "",
      initial_time: "",
      isRecurring: false,
      repeat_days: "",
      repeat_time: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: OperationFormData) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        scheduled_date: data.initial_date,
        scheduled_time: data.initial_time,
        user_tag: "admin",
        type: "LinkedIn",
        repeat_days: data.repeat_days,
        repeat_time: data.repeat_time,
      };

      const response = await scrapService.create(payload);
      toast.success("Operação agendada com sucesso!");
      onOperationCreated(response);
      form.reset();
    } catch (err) {
      console.error(err);
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
