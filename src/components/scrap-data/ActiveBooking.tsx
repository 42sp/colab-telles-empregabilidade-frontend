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
import { DeleteButton } from "./DeleteButton";
import { AnimatePresence, motion } from "framer-motion";
import type { Operation } from "@/types/operations";

type ActiveBookingProps = {
  operations?: Operation[]; // controlado pelo pai (opcional)
  onDeleted?: (uuid: string) => void;
  minRows?: number;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

// Retorna true SE a data for estritamente futura (day > today)
function isStrictlyFuture(dateStr: string) {
  if (!dateStr) return false;
  const today = new Date();
  const todayOnly = new Date(today.toDateString()); // meia-noite de hoje
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d)); // evita timezone surprises
  // comparar em UTC: construir todayOnlyUTC também
  const todayOnlyUTC = new Date(Date.UTC(todayOnly.getFullYear(), todayOnly.getMonth(), todayOnly.getDate()));
  return date.getTime() > todayOnlyUTC.getTime();
}

export function ActiveBooking({
  operations: operationsFromProps,
  onDeleted: onDeletedFromProps,
  minRows = 6,
}: ActiveBookingProps) {
  const [localOperations, setLocalOperations] = useState<Operation[]>([]);
  const isControlled = Array.isArray(operationsFromProps);

  // Fonte de dados: props (controlado) ou local (autônomo)
  const sourceOperations = isControlled ? (operationsFromProps as Operation[]) : localOperations;

  // Fetch automático se não controlado
  useEffect(() => {
    if (isControlled) return;
    let mounted = true;
    async function fetchActiveOperations() {
      try {
        const response = await scrapService.find({
          query: { $sort: { scheduled_date: 1 } },
        });
        const raw = response.data || [];
        // Filtra estritamente futuras aqui já para evitar set de itens não desejados
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

  // Filtra as operações de origem para manter apenas as futuras (caso o pai tenha enviado também)
  const futureOperations = useMemo(
    () => sourceOperations.filter((op) => isStrictlyFuture(op.scheduled_date)),
    [sourceOperations]
  );

  function handleDeleted(uuid: string) {
    // Notifica o pai se existir
    if (onDeletedFromProps) onDeletedFromProps(uuid);
    // Atualiza local se necessário
    if (!isControlled) {
      setLocalOperations((prev) => prev.filter((op) => op.uuid !== uuid));
    }
  }

  // Garante pelo menos minRows linhas (preencher com vazias)
  const emptyRowsCount = Math.max(0, minRows - futureOperations.length);
  const emptyRows = Array.from({ length: emptyRowsCount });

  const enableScroll = futureOperations.length > minRows;
  const maxHeightClass = "max-h-[360px]"; // ajuste conforme sua UI

  return (
    <Card className="border border-gray-200" role="region" aria-labelledby="active-bookings-title">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle id="active-bookings-title" className="text-zinc-900 text-2xl font-bold">
            Agendamentos Ativos
          </CardTitle>
          <p className="text-sm text-zinc-500 font-normal" id="active-bookings-description">
            Lista de operações agendadas (futuras)
          </p>
        </div>
        <span className="bg-zinc-100 text-zinc-900 px-2 py-1 rounded-md text-sm font-bold">
          {futureOperations.length}
        </span>
      </CardHeader>

      <CardContent>
        <div
          className={`border border-gray-200 rounded-lg overflow-x-auto ${enableScroll ? `overflow-y-auto ${maxHeightClass}` : "overflow-y-hidden"
            }`}
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-zinc-500 font-medium">Nome</TableHead>
                <TableHead className="text-zinc-500 font-medium">Data</TableHead>
                <TableHead className="text-zinc-500 font-medium">Hora</TableHead>
                <TableHead className="text-zinc-500 font-medium">Usuário</TableHead>
                <TableHead className="text-zinc-500 font-medium">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence initial={false}>
                {futureOperations.map((op) => (
                  <motion.tr
                    key={op.uuid}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8, height: 0, margin: 0, padding: 0 }}
                    transition={{ duration: 0.22 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-zinc-900">{op.name}</TableCell>
                    <TableCell className="text-zinc-900">{formatDate(op.scheduled_date)}</TableCell>
                    <TableCell className="text-zinc-900">{op.scheduled_time}</TableCell>
                    <TableCell className="text-zinc-900">{op.user_tag}</TableCell>
                    <TableCell>
                      <TooltipProvider delayDuration={500}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DeleteButton id={op._id} uuid={op.uuid} name={op.name} onDeleted={() => handleDeleted(op.uuid)} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {/* Linhas vazias */}
              {emptyRows.map((_, i) => (
                <TableRow key={`empty-${i}`}>
                  <TableCell className="py-4">&nbsp;</TableCell>
                  <TableCell className="py-4">&nbsp;</TableCell>
                  <TableCell className="py-4">&nbsp;</TableCell>
                  <TableCell className="py-4">&nbsp;</TableCell>
                  <TableCell className="py-4">&nbsp;</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
