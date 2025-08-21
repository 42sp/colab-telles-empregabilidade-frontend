import IconsSvg from "@/utils/IconsSvg";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import "./style.css";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectGroup, SelectValue } from "@radix-ui/react-select";
import { Label } from "../ui/label";
import { Dropzone } from "../dropzone";
import type { fileProps } from "@/types/requests/interfaces/fileProps";
import { Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useServices } from "@/hooks/useServices";
import { useEffect } from "react";

interface ConfigurationUploadArquivoProps {
	setFiles: React.Dispatch<React.SetStateAction<fileProps[]>>;
	files: fileProps[];
}

interface ConfigurationFooterProps {
	uploadFiles: () => Promise<void>;
}

const ConfigurationHeader = () => {
	return (
		<div className="container-header ">
			<h2 className="text-2xl font-bold">Configurações de Importação</h2>
			<p className="text-lg">
				Configure as fontes de dados para importação de estudantes
			</p>
		</div>
	);
};

const ConfigurationUploadArquivo = (props: ConfigurationUploadArquivoProps) => {
	const $service = useServices();

	useEffect(() => {
		const funcImportedFiles = async () => {
			try {
				const importedFiles = await $service.getImportedFiles();

				importedFiles.data.forEach(file => {
					props.setFiles(prev => [
						...prev,
						{
							status: "Sucesso",
							lastModified: file.importationDate,
							name: file.fileName || "Unknown",
							file: undefined,
							id: uuidv4(),
							userName: file.user.name || "",
						} as unknown as fileProps,
					]);
				});
			} catch (error) {
				console.error("Error fetching imported files:", error);
			}
		};

		funcImportedFiles();
	}, []);

	return (
		<div className="container-upload-arquivo">
			<div className="flex-1">
				<h2 className="text-xl font-bold">Upload de Arquivo</h2>
				<p className="mt-[6px]">
					Importe dados de estudantes através de arquivos CSV ou XLS
				</p>
			</div>
			<div className="flex-1">
				<Dropzone
					className="drop-zone"
					textClassName="text-center text-gray-500"
					setFiles={props.setFiles}
				/>
				<div className="container-selecionar-arquivo">
					<Button
						className="configuration-btns"
						onClick={() => {
							document.getElementById("file-input")?.click();
						}}
					>
						Selecionar arquivo
					</Button>
					<input
						id="file-input"
						type="file"
						accept=".csv,.xls,.xlsx"
						style={{ display: "none" }}
						onChange={e => {
							const selectedFiles = e.target.files;
							if (selectedFiles && selectedFiles.length > 0) {
								const fileArray = Array.from(selectedFiles).map(file => {
									const f = {
										file: file,
										status: "Pendente",
										lastModified: file.lastModified,
										name: file.name,
										id: uuidv4(),
									} as fileProps;

									return f;
								});
								props.setFiles(prev => [...fileArray, ...prev]);
							}
						}}
						multiple
					/>
				</div>
			</div>
			<div className="flex-1">
				<p className="font-semibold">Arquivos recentes</p>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome do Arquivo</TableHead>
							<TableHead>Data de Importação</TableHead>
							<TableHead>Usuário</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{props.files.map(m => (
							<TableRow key={m.id}>
								<TableCell>
									<span className="table-cell-base">{m.name}</span>
								</TableCell>
								<TableCell>
									<span className="table-cell-base">
										{new Date(m.lastModified).toLocaleString("pt-BR", {
											day: "2-digit",
											month: "2-digit",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										})}
									</span>
								</TableCell>
								<TableCell>
									<span className="table-cell-base">{m.userName}</span>
								</TableCell>
								<TableCell>
									<span
										className={`${m.status == "Sucesso" ? "table-cell-status-success" : "table-cell-status-pending"} font-Geist`}
									>
										{m.status}
									</span>
								</TableCell>
								{m.status != "Sucesso" ? (
									<TableCell>
										<Button
											onClick={() => {
												props.setFiles(
													props.files.filter(file => file.id !== m.id)
												);
											}}
											variant="destructive"
											className="p-2 bg-red-700 hover:bg-red-800 text-white"
										>
											<Trash2 className="w-5 h-5" />
										</Button>
									</TableCell>
								) : (
									<></>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

const ConfigurationIntegracaoApi = () => {
	return (
		<div className="container-integracao-api">
			<h2 className="text-xl font-bold">Integração via API</h2>
			<p className="mt-[6px]">
				Configure a integração com API externa para importação automática
			</p>
			<form className="container-form-integracao-api">
				<Field
					id="urlApi"
					label="URL da API"
					placeholder="https://api.exemplo.com/estudantes"
				/>
				<Field
					id="tokenAutenticacao"
					label="Token de Autenticação"
					placeholder="Insira seu token de autenticação"
					type="password"
				/>
				{/* <Field
					id="frequenciaSincronizacao"
					label="Frequência de Sincronização"
					placeholder="Selecione a frequência"
				/> */}
				<Label>Frequência de Sincronização</Label>
				<Select>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Selecione a frequência" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="1">1 Hora</SelectItem>
							<SelectItem value="3">3 Horas</SelectItem>
							<SelectItem value="6">6 Horas</SelectItem>
							<SelectItem value="12">12 Horas</SelectItem>
							<SelectItem value="24">24 Horas</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>

				<div className="container-ultima-sincronizacao">
					<div>
						<img
							src={IconsSvg.clock}
							alt="Clock Icon"
							className="inline-block mr-1"
						/>
						<span className="label-ultima-sincronizacao mr-1">
							Última sincronização:
						</span>
						<span className="value-ultima-sincronizacao">
							Nunca sincronizado
						</span>
					</div>
					<Button variant="outline">
						<img
							src={IconsSvg.sync}
							alt="Clock Icon"
							className="inline-block mr-1"
						/>
						Sincronizar agora
					</Button>
				</div>

				<div className="container-salvar-configuracoes">
					<Button className="configuration-btns">Salvar Configurações</Button>
				</div>
			</form>
		</div>
	);
};

const ConfigurationFooter = (params: ConfigurationFooterProps) => {
	return (
		<div className="container-footer">
			<Button className="footer-btns" variant="outline">
				Restaurar Configurações Padrão
			</Button>
			<Button
				className="footer-btns bg-[#16A34A] hover:bg-[#15803D]"
				onClick={params.uploadFiles}
			>
				Salvar Todas as Configurações
			</Button>
		</div>
	);
};

export {
	ConfigurationHeader,
	ConfigurationUploadArquivo,
	ConfigurationIntegracaoApi,
	ConfigurationFooter,
};
