import { TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { DeleteButton } from "./DeleteButton";
import { RecurrenceIndicatorButton } from "./RecurrenceIndicatorButton";
import { motion } from "framer-motion";
import type { Operation } from "@/types/operations";
import React from "react";

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

type Props = {
  operation: Operation;
  onEdit: () => void;
  onDeleted: () => void;
  showLastOccurrence?: boolean;
  showLastOccurrencePrice?: boolean;
  showRecurrenceInterval?: boolean;
  showExecutionInfo?: boolean;
  showCreatedBy?: boolean;
  showCreatedAt?: boolean;
};

// 🔹 Memoizado para prevenir re-render desnecessário
export const OperationTableRow = React.memo(function OperationTableRow({
  operation,
  onEdit,
  onDeleted,
  showLastOccurrence = false,
  showLastOccurrencePrice = false,
  showRecurrenceInterval = false,
  showExecutionInfo = false,
  showCreatedBy = false,
  showCreatedAt = false,
}: Props) {
  const isRecurring = Boolean(operation.repeat_days || operation.repeat_time);

  return (
    <motion.tr
      layout
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22 }}
      className="hover:bg-gray-50 min-h-[41px] max-h-[41px] h-[41px] align-middle border-b border-gray-200"
    >
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">{operation.name}</TableCell>
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">{formatDate(operation.scheduled_date)}</TableCell>
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">{operation.scheduled_time || "-"}</TableCell>
      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">{operation.user_tag || "-"}</TableCell>

      {showLastOccurrence && (
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {operation.last_occurrence || "-"}
        </TableCell>
      )}

      {showLastOccurrencePrice && (
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {operation.last_occurrence_price
            ? `R$ ${Number(operation.last_occurrence_price).toFixed(2)}`
            : "-"}
        </TableCell>
      )}

      {showRecurrenceInterval && (
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {operation.repeat_days || "-"}
        </TableCell>
      )}

      {showExecutionInfo && (
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {operation.status || "-"}
        </TableCell>
      )}

      {showCreatedBy && (
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {operation.created_by || "-"}
        </TableCell>
      )}

      {showCreatedAt && (
        <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {formatDate(operation.created_at)}
        </TableCell>
      )}

      <TableCell className="flex gap-2 justify-start py-1">
        {/* <RecurrenceIndicatorButton isRecurring={isRecurring} /> */}

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={onEdit}
                aria-label="Editar operação"
                className="hover:bg-gray-700 hover:text-white cursor-pointer h-8 w-8"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editar operação</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DeleteButton id={operation.id} name={operation.name} onDeleted={onDeleted} />
      </TableCell>
    </motion.tr>
  );
}, (prev, next) => {
  // 🔹 Só re-renderiza se a operação mudou ou colunas visíveis mudaram
  return (
    prev.operation === next.operation &&
    prev.showLastOccurrence === next.showLastOccurrence &&
    prev.showLastOccurrencePrice === next.showLastOccurrencePrice &&
    prev.showRecurrenceInterval === next.showRecurrenceInterval &&
    prev.showExecutionInfo === next.showExecutionInfo &&
    prev.showCreatedBy === next.showCreatedBy &&
    prev.showCreatedAt === next.showCreatedAt
  );
});