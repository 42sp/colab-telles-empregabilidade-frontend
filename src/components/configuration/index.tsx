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
				<Dropzone
					className="drop-zone"
					textClassName="text-center text-gray-500"
				/>
				<div className="container-selecionar-arquivo">
					<Button
						className="configuration-btns"
						onClick={() => console.log("Selecionar")}
					>
						Selecionar arquivo
					</Button>
				</div>
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
							<TableCell>
								<span className="table-cell-base">estudantes_2023.csv</span>
							</TableCell>
							<TableCell>
								<span className="table-cell-base">10/05/2023 13:40</span>
							</TableCell>
							<TableCell>
								<span className="table-cell-status font-Geist">Concluído</span>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<span className="table-cell-base">teste.csv</span>
							</TableCell>
							<TableCell>
								<span className="table-cell-base">10/05/2020 06:40</span>
							</TableCell>
							<TableCell>
								<span className="table-cell-status font-Geist">Concluído</span>
							</TableCell>
						</TableRow>
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

const ConfigurationFooter = () => {
	return (
		<div className="container-footer">
			<Button className="footer-btns" variant="outline">
				Restaurar Configurações Padrão
			</Button>
			<Button className="footer-btns bg-[#16A34A] hover:bg-[#15803D]">
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
