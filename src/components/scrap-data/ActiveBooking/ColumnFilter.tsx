import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ColumnFilterProps = {
  showLastOccurrence: boolean;
  setShowLastOccurrence: (value: boolean) => void;
  showLastOccurrencePrice: boolean;
  setShowLastOccurrencePrice: (value: boolean) => void;
  showRecurrenceInterval: boolean;
  setShowRecurrenceInterval: (value: boolean) => void;
  showExecutionInfo?: boolean;
  setShowExecutionInfo?: (value: boolean) => void;
  showCreatedBy?: boolean;
  setShowCreatedBy?: (value: boolean) => void;
  showCreatedAt?: boolean;
  setShowCreatedAt?: (value: boolean) => void;
};

export function ColumnFilter({
  showLastOccurrence,
  setShowLastOccurrence,
  showLastOccurrencePrice,
  setShowLastOccurrencePrice,
  showRecurrenceInterval,
  setShowRecurrenceInterval,
  showExecutionInfo = false,
  setShowExecutionInfo,
  showCreatedBy = false,
  setShowCreatedBy,
  showCreatedAt = false,
  setShowCreatedAt,
}: ColumnFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Filtrar Colunas
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60">
        {/* ---------------- Agendamento ---------------- */}
        <DropdownMenuLabel>Agendamento</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showLastOccurrence}
          onCheckedChange={setShowLastOccurrence}
        >
          Última ocorrência
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showLastOccurrencePrice}
          onCheckedChange={setShowLastOccurrencePrice}
        >
          Preço da Última ocorrência
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showRecurrenceInterval}
          onCheckedChange={setShowRecurrenceInterval}
        >
          Intervalo de Recorrência
        </DropdownMenuCheckboxItem>

        {/* ---------------- Execução ---------------- */}
        {setShowExecutionInfo && (
          <>
            <DropdownMenuLabel>Execução</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showExecutionInfo}
              onCheckedChange={setShowExecutionInfo}
            >
              Informações de Execução
            </DropdownMenuCheckboxItem>
          </>
        )}

        {/* ---------------- Auditoria (CreatedBy / CreatedAt) ---------------- */}
        {(setShowCreatedBy || setShowCreatedAt) && (
          <>
            <DropdownMenuLabel>Auditoria</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {setShowCreatedBy && (
              <DropdownMenuCheckboxItem
                checked={showCreatedBy}
                onCheckedChange={setShowCreatedBy}
              >
                Criado por
              </DropdownMenuCheckboxItem>
            )}
            {setShowCreatedAt && (
              <DropdownMenuCheckboxItem
                checked={showCreatedAt}
                onCheckedChange={setShowCreatedAt}
              >
                Data de Criação
              </DropdownMenuCheckboxItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
