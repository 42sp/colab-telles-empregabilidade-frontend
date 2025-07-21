import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";

interface SyncStatusData {
	lastSync: string;
	status: string;
	processedRecords: number;
	processingTime: string;
	nextSync: string;
}

export function SyncStatusTable({ data }: { data: SyncStatusData }) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-5 gap-4">
				<div>
					<p className="text-sm text-gray-500">Última sincronização</p>
					<p className="font-medium">{data.lastSync}</p>
				</div>
				<div>
					<p className="text-sm text-gray-500">Status</p>
					<p className="font-medium flex items-center gap-2">
						<span className="w-2 h-2 bg-green-500 rounded-full" />
						{data.status}
					</p>
				</div>
				<div>
					<p className="text-sm text-gray-500">Registros processados</p>
					<p className="font-medium">{data.processedRecords} registros</p>
				</div>
				<div>
					<p className="text-sm text-gray-500">Tempo de processamento</p>
					<p className="font-medium">{data.processingTime}</p>
				</div>
				<div>
					<p className="text-sm text-gray-500">Próxima sincronização</p>
					<p className="font-medium">{data.nextSync}</p>
				</div>
			</div>
		</div>
	);
}
