import { motion } from "framer-motion";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { DeleteButton } from "./DeleteButton";
import { RecurrenceIndicatorButton } from "./RecurrenceIndicatorButton";
import type { Operation } from "@/types/operations";

type Props = {
  operation: Operation;
  isRecurring: boolean;
  onEdit: () => void;
  onDeleted: () => void;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function OperationTableRow({ operation, isRecurring, onEdit, onDeleted }: Props) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22 }}
      className="hover:bg-gray-50"
    >
      <TableCell>{operation.name}</TableCell>
      <TableCell>{formatDate(operation.scheduled_date)}</TableCell>
      <TableCell>{operation.scheduled_time}</TableCell>
      <TableCell>{operation.user_tag}</TableCell>
      <TableCell className="flex gap-2 justify-start py-2">
        <RecurrenceIndicatorButton isRecurring={isRecurring} />

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={onEdit}
                aria-label="Editar operação"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editar operação</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteButton
                id={operation._id}
                uuid={operation.uuid}
                name={operation.name}
                onDeleted={onDeleted}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Excluir</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </motion.tr>
  );
}
