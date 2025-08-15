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
};

export function ColumnFilter({
	showLastOccurrence,
	setShowLastOccurrence,
	showLastOccurrencePrice,
	setShowLastOccurrencePrice,
	showRecurrenceInterval,
	setShowRecurrenceInterval,
}: ColumnFilterProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="cursor-pointer">
					Filtrar Colunas
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Colunas Opcionais</DropdownMenuLabel>
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
