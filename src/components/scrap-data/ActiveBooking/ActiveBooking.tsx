import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditOperationModal } from "./EditOperationModal";
import { OperationTableRow } from "./OperationTableRow";
import { ColumnFilter } from "./ColumnFilter";
import { motion, AnimatePresence } from "framer-motion";
import type { Operation } from "@/types/operations";
import { useOperationsState, useOperationsActions } from "@/contexts/ScrapOperationsContext";

type ActiveBookingProps = {
  onDeleted?: (id: string) => void;
  minRows?: number;
};

export function ActiveBooking({ onDeleted: onDeletedFromProps, minRows = 6 }: ActiveBookingProps) {
  const { operations, loading } = useOperationsState();
  const { deleteOperation, updateOperation, refresh } = useOperationsActions();

  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);

  // ------------------------------
  // 🔹 Colunas opcionais (UI local)
  // ------------------------------
  const [columnVisibility, setColumnVisibility] = useState({
    lastOccurrence: false,
    lastOccurrencePrice: false,
    recurrenceInterval: false,
    executionInfo: false,
    createdBy: false,
    createdAt: false,
  });

  // ------------------------------
  // 🔹 Filtrar operações ativas 
  // ------------------------------
  const today = new Date().toISOString().split("T")[0];

  const activeOperations = useMemo(() => {
    if (!operations) return [];
    return operations.filter(op => {
      const notDeleted = !op.deleted;
      const hasDate = Boolean(op.scheduled_date);
      const futureOrToday = !op.scheduled_date || op.scheduled_date >= today;
      const notConcluded = op.status !== "Concluído";
      return notDeleted && hasDate && futureOrToday && notConcluded;
    });
  }, [operations, today]);

  // ------------------------------
  // 🔹 Manipulação de eventos (delegados para o Context)
  // ------------------------------
  async function handleDeleted(id: string) {
    const success = await deleteOperation(id);
    if (success) onDeletedFromProps?.(id);
  }

  async function handleUpdate(updated: Operation) {
    const result = await updateOperation(updated.id, updated);
    if (result) setEditingOperation(null);
  }

  const emptyRowsCount = Math.max(0, minRows - activeOperations.length);
  const emptyRows = Array.from({ length: emptyRowsCount });
  const enableScroll = activeOperations.length > minRows;

  const dynamicColumnsCount =
    Number(columnVisibility.lastOccurrence) +
    Number(columnVisibility.lastOccurrencePrice) +
    Number(columnVisibility.recurrenceInterval) +
    Number(columnVisibility.executionInfo) +
    Number(columnVisibility.createdBy) +
    Number(columnVisibility.createdAt);

  const totalColumns = 5 + dynamicColumnsCount;

  // ------------------------------
  // 🔹 Render
  // ------------------------------
  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-zinc-900 text-2xl font-bold">Agendamentos Ativos</CardTitle>
          <p className="text-sm text-zinc-500 font-normal">Lista de operações agendadas</p>
        </div>

        <div className="flex items-center gap-3">
          <ColumnFilter
            showLastOccurrence={columnVisibility.lastOccurrence}
            setShowLastOccurrence={value => setColumnVisibility(prev => ({ ...prev, lastOccurrence: value }))}
            showLastOccurrencePrice={columnVisibility.lastOccurrencePrice}
            setShowLastOccurrencePrice={value => setColumnVisibility(prev => ({ ...prev, lastOccurrencePrice: value }))}
            showRecurrenceInterval={columnVisibility.recurrenceInterval}
            setShowRecurrenceInterval={value => setColumnVisibility(prev => ({ ...prev, recurrenceInterval: value }))}
            showExecutionInfo={columnVisibility.executionInfo}
            setShowExecutionInfo={value => setColumnVisibility(prev => ({ ...prev, executionInfo: value }))}
            showCreatedBy={columnVisibility.createdBy}
            setShowCreatedBy={value => setColumnVisibility(prev => ({ ...prev, createdBy: value }))}
            showCreatedAt={columnVisibility.createdAt}
            setShowCreatedAt={value => setColumnVisibility(prev => ({ ...prev, createdAt: value }))}
          />
          <span className="bg-zinc-100 text-zinc-900 px-2 py-1 rounded-md text-sm font-bold">
            {loading ? "..." : activeOperations.length}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className={`border border-gray-200 rounded-lg overflow-x-auto ${enableScroll ? "overflow-y-auto max-h-[360px]" : "overflow-y-hidden"}`}>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 sticky top-0 z-10">
                <TableHead>Nome</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Usuário</TableHead>

                <AnimatePresence>
                  {columnVisibility.lastOccurrence && (
                    <motion.th initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="px-2 text-left font-medium text-gray-700">
                      Última ocorrência
                    </motion.th>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {columnVisibility.lastOccurrencePrice && (
                    <motion.th initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="px-2 text-left font-medium text-gray-700">
                      Preço da última ocorrência
                    </motion.th>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {columnVisibility.recurrenceInterval && (
                    <motion.th initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="px-2 text-left font-medium text-gray-700">
                      Intervalo de recorrência
                    </motion.th>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {columnVisibility.executionInfo && (
                    <motion.th initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="px-2 text-left font-medium text-gray-700">
                      Status
                    </motion.th>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {columnVisibility.createdBy && (
                    <motion.th initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="px-2 text-left font-medium text-gray-700">
                      Criado por
                    </motion.th>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {columnVisibility.createdAt && (
                    <motion.th initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="px-2 text-left font-medium text-gray-700">
                      Data de criação
                    </motion.th>
                  )}
                </AnimatePresence>

                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence initial={false}>
                {activeOperations.map(op => (
                  <OperationTableRow
                    key={op.id}
                    operation={op}
                    onEdit={() => setEditingOperation(op)}
                    onDeleted={() => handleDeleted(op.id.toString())}
                    showLastOccurrence={columnVisibility.lastOccurrence}
                    showLastOccurrencePrice={columnVisibility.lastOccurrencePrice}
                    showRecurrenceInterval={columnVisibility.recurrenceInterval}
                    showExecutionInfo={columnVisibility.executionInfo}
                    showCreatedAt={columnVisibility.createdAt}
                    showCreatedBy={columnVisibility.createdBy}
                  />
                ))}

                {emptyRows.map((_, i) => (
                  <TableRow key={`empty-${i}`}>
                    <TableCell colSpan={totalColumns} className="py-4" />
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
