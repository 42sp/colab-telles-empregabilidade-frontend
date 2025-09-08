export interface SyncStatusData {
	lastSync: string;
	status: string;
	processedRecords: number;
	processingTime: string;
	nextSync: string;
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
};

export function SyncStatusTable({ data }: { data?: SyncStatusData }) {
	return (
		<>
			{data && (
				<div className="space-y-6">
					<div className="grid grid-cols-5 gap-4">
						<div>
							<p className="text-base text-gray-500">Última sincronização</p>
							<p className="text-base font-medium">
								{formatDate(data.lastSync)}
							</p>
						</div>
						<div>
							<p className="text-base text-gray-500">Status</p>
							<p className="text-base font-medium flex items-center gap-2">
								<span className="w-2 h-2 bg-green-500 rounded-full" />
								{data.status}
							</p>
						</div>
						<div>
							<p className="text-base text-gray-500">Registros processados</p>
							<p className="text-base font-medium">
								{data.processedRecords} registros
							</p>
						</div>
						<div>
							<p className="text-base text-gray-500">Tempo de processamento</p>
							<p className="text-base font-medium">{data.processingTime}</p>
						</div>
						<div>
							<p className="text-base text-gray-500">Próxima sincronização</p>
							<p className="text-base font-medium">
								{formatDate(data.nextSync)}
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
