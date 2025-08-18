import { useEffect, useMemo, useState } from "react";
import { scrapService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditOperationModal } from "./EditOperationModal";
import { OperationTableRow } from "./OperationTableRow";
import { ColumnFilter } from "./ColumnFilter";
import { motion, AnimatePresence } from "framer-motion";
import type { Operation } from "@/types/operations";

type ActiveBookingProps = {
  onDeleted?: (uuid: string) => void;
  minRows?: number;
};

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
  onDeleted: onDeletedFromProps,
  minRows = 6,
}: ActiveBookingProps) {
  const [localOperations, setLocalOperations] = useState<Operation[]>([]);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);
  const [showLastOccurrence, setShowLastOccurrence] = useState(false);
  const [showLastOccurrencePrice, setShowLastOccurrencePrice] = useState(false);
  const [showRecurrenceInterval, setShowRecurrenceInterval] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchActiveOperations() {
      try {
        const response = await scrapService.find({
          query: { $sort: { scheduled_date: 1 } },
        });

        const raw = response.data || [];
        const futureOps = raw.filter((op: Operation) => isStrictlyFuture(op.scheduled_date));

        if (mounted) {
          setLocalOperations(futureOps);
        }
      } catch (err) {
        console.error("❌ Erro ao buscar agendamentos ativos:", err);
      }
    }

    fetchActiveOperations();
    return () => { mounted = false; };
  }, []);

  const futureOperations = useMemo(
    () => localOperations.filter(op => isStrictlyFuture(op.scheduled_date)),
    [localOperations]
  );

  function handleDeleted(uuid: string) {
    onDeletedFromProps?.(uuid);
    setLocalOperations(prev => prev.filter(op => op.uuid !== uuid));
  }

  function handleUpdate(updated: Operation) {
    setLocalOperations(prev => prev.map(op => (op.uuid === updated.uuid ? updated : op)));
  }

  const emptyRowsCount = Math.max(0, minRows - futureOperations.length);
  const emptyRows = Array.from({ length: emptyRowsCount });
  const enableScroll = futureOperations.length > minRows;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-zinc-900 text-2xl font-bold">
            Agendamentos Ativos
          </CardTitle>
          <p className="text-sm text-zinc-500 font-normal">
            Lista de operações agendadas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ColumnFilter
            showLastOccurrence={showLastOccurrence}
            setShowLastOccurrence={setShowLastOccurrence}
            showLastOccurrencePrice={showLastOccurrencePrice}
            setShowLastOccurrencePrice={setShowLastOccurrencePrice}
            showRecurrenceInterval={showRecurrenceInterval}
            setShowRecurrenceInterval={setShowRecurrenceInterval}
          />
          <span className="bg-zinc-100 text-zinc-900 px-2 py-1 rounded-md text-sm font-bold">
            {futureOperations.length}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div
          className={`border border-gray-200 rounded-lg overflow-x-auto ${
            enableScroll ? "overflow-y-auto max-h-[360px]" : "overflow-y-hidden"
          }`}
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 sticky top-0 z-10">
                <TableHead>Nome</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <AnimatePresence>
                  {showLastOccurrence && (
                    <motion.th
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 py-2 text-left font-medium text-gray-700"
                    >
                      Última ocorrência
                    </motion.th>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {showLastOccurrencePrice && (
                    <motion.th
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 py-2 text-left font-medium text-gray-700"
                    >
                      Preço da última ocorrência
                    </motion.th>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {showRecurrenceInterval && (
                    <motion.th
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 py-2 text-left font-medium text-gray-700"
                      >
                      Intervalo de recorrência
                      </motion.th>
                  )}
                </AnimatePresence>

                  

                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence initial={false}>
                {futureOperations.map(op => (
                  <OperationTableRow
                    key={op.uuid}
                    operation={op}
                    onEdit={() => setEditingOperation(op)}
                    onDeleted={() => handleDeleted(op.uuid)}
                    showLastOccurrence={showLastOccurrence}
                    showLastOccurrencePrice={showLastOccurrencePrice}
                    showRecurrenceInterval={showRecurrenceInterval}
                  />
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
