import {
	ConfigurationFooter,
	ConfigurationHeader,
	ConfigurationIntegracaoApi,
	ConfigurationUploadArquivo,
} from "@/components/import";
import { FadeInOnScroll } from "@/components/utils/FadeInOnScroll";
import { useServices } from "@/hooks/useServices";
import type { fileProps } from "@/types/requests/interfaces/fileProps";
import { useState } from "react";
import { toast } from "react-toastify";

const Configuration = () => {
	const [files, setFiles] = useState<fileProps[]>([]);

	const $services = useServices();

	const uploadFiles = async () => {
		if (files.length === 0) {
			toast.info("Nenhum arquivo selecionado");
			return;
		}

		for (const file of files) {
			try {
				const response = await toast.promise(
					$services.postImportFiles({ file }),
					{
						pending: `Exportando arquivo ${file.name}...`,
						success: `Arquivo ${file.name} importado com sucesso 👌`,
						error: `Erro ao importar o arquivo ${file.name} 🤯`,
					}
				);

				if ([200, 201].includes(response.status)) {
					file.status = "Sucesso";
					setFiles([...files]);
				}
			} catch (error) {
				console.error(error);
				if (
					error instanceof Error &&
					(
						error as {
							response?: {
								data?: {
									message?: string;
								};
							};
						}
					)?.response?.data?.message?.includes("duplicate key value")
				) {
					toast.info(
						`O arquivo ${file.name} contém estudantes com IDs que já foram importados anteriormente.`
					);
				}
			}
		}
	};

	return (
		<div className="contain-layout container mx-auto">
			<ConfigurationHeader />
			<FadeInOnScroll>
				<ConfigurationUploadArquivo setFiles={setFiles} files={files} />
			</FadeInOnScroll>
			<FadeInOnScroll>
				<ConfigurationIntegracaoApi />
			</FadeInOnScroll>
			<FadeInOnScroll>
				<ConfigurationFooter uploadFiles={uploadFiles} />
			</FadeInOnScroll>
		</div>
	);
};

export default Configuration;
