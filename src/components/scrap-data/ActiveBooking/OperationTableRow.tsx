import { TableCell, TableRow } from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { DeleteButton } from "./DeleteButton";
import { RecurrenceIndicatorButton } from "./RecurrenceIndicatorButton";
import { motion, AnimatePresence } from "framer-motion";
import type { Operation } from "@/types/operations";


function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

type Props = {
  operation: Operation;
  onEdit: () => void;
  onDeleted: () => void;
  showLastOccurrence?: boolean;
  showLastOccurrencePrice?: boolean;
  showRecurrenceInterval?: boolean;
};

export function OperationTableRow({
  operation,
  onEdit,
  onDeleted,
  showLastOccurrence = false,
  showLastOccurrencePrice = false,
  showRecurrenceInterval = false,
}: Props) {
  const isRecurring = Boolean(operation.repeat_days || operation.repeat_time);

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

      <AnimatePresence>
        {showLastOccurrence && (
          <motion.td
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {operation.last_occurrence || "-"}
          </motion.td>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLastOccurrencePrice && (
          <motion.td
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {operation.last_occurrence_price
              ? `R$ ${Number(operation.last_occurrence_price).toFixed(2)}`
              : "-"}
          </motion.td>
        )}
      </AnimatePresence>

            <AnimatePresence>
        {showRecurrenceInterval && (
          <motion.td
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {operation.last_occurrence_price
              ? `R$ ${Number(operation.last_occurrence_price).toFixed(2)}`
              : "-"}
          </motion.td>
        )}
      </AnimatePresence>

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
                className="hover:bg-gray-700 hover:text-white cursor-pointer"
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