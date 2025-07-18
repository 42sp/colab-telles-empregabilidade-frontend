import { Button } from "../ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import "./style.css";

const ConfigurationHeader = () => {
	return (
		<div className="container-header">
			<h2 className="text-2xl font-bold">Configurações de Importação</h2>
			<p className="text-lg">
				Configure as fontes de dados para importação de estudantes
			</p>
		</div>
	);
};

const ConfigurationUploadArquivo = () => {
	return (
		<div className="container-upload-arquivo">
			<div className="flex-1">
				<h2 className="text-xl font-bold">Upload de Arquivo</h2>
				<p className="mt-[6px]">
					Importe dados de estudantes através de arquivos CSV ou XLS
				</p>
			</div>
			<div className="flex-1">
				<div className="drop-zone">
					<p className="text-center text-gray-500">
						Arraste e solte o arquivo aqui ou clique para selecionar
					</p>
					<input type="file" accept=".csv, .xls" className="hidden" />
				</div>
				<Button className="btn-upload">Selecionar arquivo</Button>
			</div>
			<div className="flex-1">
				<p className="font-semibold">Arquivos recentes</p>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome do Arquivo</TableHead>
							<TableHead>Data de Importação</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>estudantes_2023.csv</TableCell>
							<TableCell>10/05/2023 13:40</TableCell>
							<TableCell>Concluído</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export { ConfigurationHeader, ConfigurationUploadArquivo };
