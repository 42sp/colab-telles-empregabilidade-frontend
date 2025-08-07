import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/formInput";
import { Calendar, Clock, Tag, Repeat } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { useOperationFormContext } from "@/contexts/useOperationFormContext";

type NewOperationProps = {
  isSubmitting: boolean;
};

export function NewOperation({ isSubmitting }: NewOperationProps) {
  const form = useOperationFormContext();
  const isRecurring = form.watch("isRecurring");

  return (
    <Card role="form" aria-labelledby="new-operation-title">
      <CardHeader>
        <CardTitle id="new-operation-title" className="text-2xl font-bold">
          Agendar nova operação
        </CardTitle>
        <p className="text-sm text-muted-foreground" id="new-operation-description">
          Preencha os campos para agendar uma nova operação de scraping
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-8" aria-describedby="new-operation-description">

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
                onCheckedChange={(checked) => form.setValue("isRecurring", checked)}
              />
              <Label htmlFor="recorrente" className="font-semibold flex items-center gap-2">
                <Repeat size={18} />
                Recorrência
              </Label>
            </div>

            <AnimatePresence>
              {isRecurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-5">
                    <FormInput
                      name="repeat_days"
                      label="A cada quantos dias?"
                      type="number"
                      min={1}
                      placeholder="Ex: 7"
                      wrapperClassName="flex-1 min-w-[150px]"
                      inputClassName="w-full"
                    />
                    <FormInput
                      name="repeat_time"
                      label="Hora da recorrência"
                      type="time"
                      iconPrepend={<Clock />}
                      wrapperClassName="flex-1 min-w-[150px]"
                      inputClassName="w-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-[42px] min-w-[130px]"
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
