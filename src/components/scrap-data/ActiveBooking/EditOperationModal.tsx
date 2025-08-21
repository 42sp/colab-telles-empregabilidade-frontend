// components/scrap-data/ActiveBooking/EditOperationModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import {
  OperationFormProvider,
  operationFormSchema,
  type OperationFormData,
} from "@/contexts/useOperationFormContext";
import { EditOperationForm } from "./EditOperationForm";
import type { Operation } from "@/types/operations";
import { useOperationsActions } from "@/contexts/ScrapOperationsContext";

type EditOperationModalProps = {
  operation: Operation;
  onClose: () => void;
  onOperationUpdated?: (op: Operation) => void; // opcional, para compatibilidade
};

export function EditOperationModal({
  operation,
  onClose,
  onOperationUpdated,
}: EditOperationModalProps) {
  const { updateOperation } = useOperationsActions();

  const form = useForm<OperationFormData>({
    resolver: zodResolver(operationFormSchema),
    defaultValues: {
      name: operation.name,
      initial_date: operation.scheduled_date || "",
      initial_time: operation.scheduled_time || "",
      isRecurring: Boolean(operation.repeat_time),
      repeat_days: operation.repeat_days ?? "",
      repeat_time: operation.repeat_time ?? "",
    },
  });

  async function onSubmit(data: OperationFormData) {
    try {
      const payload = {
        name: data.name,
        scheduled_date: data.initial_date,
        scheduled_time: data.initial_time,
        user_tag: operation.user_tag,
        repeat_days: data.isRecurring ? data.repeat_days ?? undefined : undefined,
  		repeat_time: data.isRecurring ? data.repeat_time ?? undefined : undefined,
      };

      const updated = await updateOperation(operation.id, payload);

      if (updated) {
        toast.success("Operação atualizada com sucesso!");
        onOperationUpdated?.(updated);
        onClose();
      } else {
        toast.error("Erro ao atualizar operação");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar operação");
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Editar Operação
          </DialogTitle>
          <p className="text-sm text-muted-foreground" id="edit-operation-description">
            Atualize os campos para editar esta operação
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <OperationFormProvider value={form}>
              <EditOperationForm
                isSubmitting={form.formState.isSubmitting}
                operationId={operation.id}
              />
            </OperationFormProvider>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
