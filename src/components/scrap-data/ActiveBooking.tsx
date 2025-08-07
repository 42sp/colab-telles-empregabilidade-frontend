import { useEffect, useMemo, useState } from "react";
import { scrapService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "./DeleteButton";
import { AnimatePresence, motion } from "framer-motion";
import { EditOperationModal } from "./EditOperationModal";
import { CheckCircle2, Loader2, Repeat, Settings2 } from "lucide-react";
import type { Operation } from "@/types/operations";

type ActiveBookingProps = {
  operations?: Operation[];
  onDeleted?: (uuid: string) => void;
  minRows?: number;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function isStrictlyFuture(dateStr: string) {
  if (!dateStr) return false;
  const today = new Date();
  const todayOnly = new Date(today.toDateString());
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const todayOnlyUTC = new Date(Date.UTC(todayOnly.getFullYear(), todayOnly.getMonth(), todayOnly.getDate()));
  return date.getTime() > todayOnlyUTC.getTime();
}

export function ActiveBooking({
  operations: operationsFromProps,
  onDeleted: onDeletedFromProps,
  minRows = 6,
}: ActiveBookingProps) {
  const [localOperations, setLocalOperations] = useState<Operation[]>([]);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);
  const [recurrenceMap, setRecurrenceMap] = useState<Record<string, boolean>>({});

  const isControlled = Array.isArray(operationsFromProps);
  const sourceOperations = isControlled ? operationsFromProps : localOperations;

  useEffect(() => {
    if (isControlled) return;
    let mounted = true;
    async function fetchActiveOperations() {
      try {
        const response = await scrapService.find({
          query: { $sort: { scheduled_date: 1 } },
        });
        const raw = response.data || [];
        const futureOps = raw.filter((op: Operation) => isStrictlyFuture(op.scheduled_date));
        if (mounted) setLocalOperations(futureOps);
      } catch (err) {
        console.error("Erro ao buscar agendamentos ativos:", err);
      }
    }
    fetchActiveOperations();
    return () => {
      mounted = false;
    };
  }, [isControlled]);

  const futureOperations = useMemo(
    () => sourceOperations.filter((op) => isStrictlyFuture(op.scheduled_date)),
    [sourceOperations]
  );

  function handleDeleted(uuid: string) {
    if (onDeletedFromProps) onDeletedFromProps(uuid);
    if (!isControlled) {
      setLocalOperations((prev) => prev.filter((op) => op.uuid !== uuid));
    }
  }

  function toggleRecurrence(op: Operation) {
    setRecurrenceMap((prev) => {
      const newValue = !prev[op.uuid];
      if (newValue) {
        const next = new Date();
        next.setDate(next.getDate() + 7);
        console.log(`🟢 Recorrência ativada para ${op.name}. Próxima: ${next.toLocaleDateString()}`);
      } else {
        console.log(`🔴 Recorrência desativada para ${op.name}`);
      }
      return { ...prev, [op.uuid]: newValue };
    });
  }

  function handleUpdate(updated: Operation) {
    if (!isControlled) {
      setLocalOperations((prev) =>
        prev.map((op) => (op.uuid === updated.uuid ? updated : op))
      );
    }
  }

  const emptyRowsCount = Math.max(0, minRows - futureOperations.length);
  const emptyRows = Array.from({ length: emptyRowsCount });
  const enableScroll = futureOperations.length > minRows;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-zinc-900 text-2xl font-bold">Agendamentos Ativos</CardTitle>
          <p className="text-sm text-zinc-500 font-normal">Lista de operações agendadas (futuras)</p>
        </div>
        <span className="bg-zinc-100 text-zinc-900 px-2 py-1 rounded-md text-sm font-bold">
          {futureOperations.length}
        </span>
      </CardHeader>

      <CardContent>
        <div
          className={`border border-gray-200 rounded-lg overflow-x-auto ${
            enableScroll ? "overflow-y-auto max-h-[360px]" : "overflow-y-hidden"
          }`}
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Nome</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence initial={false}>
                {futureOperations.map((op) => (
                  <motion.tr
                    key={op.uuid}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{op.name}</TableCell>
                    <TableCell>{formatDate(op.scheduled_date)}</TableCell>
                    <TableCell>{op.scheduled_time}</TableCell>
                    <TableCell>{op.user_tag}</TableCell>
                    <TableCell className="flex gap-2 justify-end py-2">
                      {/* Recorrência */}
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant={recurrenceMap[op.uuid] ? "success" : "outline"}
                              onClick={() => toggleRecurrence(op)}
                              aria-label="Alternar recorrência"
                            >
                              {recurrenceMap[op.uuid] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Repeat className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Alternar recorrência</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Editar */}
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => setEditingOperation(op)}
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

                      {/* Excluir */}
                      <TooltipProvider delayDuration={500}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DeleteButton
                              id={op._id}
                              uuid={op.uuid}
                              name={op.name}
                              onDeleted={() => handleDeleted(op.uuid)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </motion.tr>
                ))}

                {emptyRows.map((_, i) => (
                  <TableRow key={`empty-${i}`}>
                    <TableCell colSpan={5} className="py-4" />
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Modal de edição */}
      {editingOperation && (
        <EditOperationModal
          operation={editingOperation}
          onClose={() => setEditingOperation(null)}
          onOperationUpdated={handleUpdate}
        />
      )}
    </Card>
  );
}
