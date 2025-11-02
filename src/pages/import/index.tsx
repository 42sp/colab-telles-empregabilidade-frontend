import {
	ConfigurationHeader,
	ConfigurationIntegracaoApi,
	ConfigurationUploadArquivo,
} from "@/components/import";
import { FadeInOnScroll } from "@/components/utils/FadeInOnScroll";
import { useSidebar } from "@/contexts/SidebarContext";
import { useServices } from "@/hooks/useServices";
import type { fileProps } from "@/types/requests/interfaces/fileProps";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Configuration = () => {
	const { animationsEnabled } = useSidebar();
	const [files, setFiles] = useState<fileProps[]>([]);

	const $services = useServices();

	const uploadFiles = async () => {
		if (files.filter(file => file.status === "Pendente").length === 0) {
			toast.info("Nenhum arquivo selecionado");
			return;
		}

		for (const file of files) {
			try {
				if (file.file === undefined || file.status === "Sucesso") continue;
				const response = await toast.promise(
					$services.postImportFiles({ file }),
					{
						pending: `Importando arquivo ${file.name}...`,
						success: `Arquivo ${file.name} importado com sucesso 👌. Aguarde alguns instantes para que os dados sejam atualizados.`,
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
			<ToastContainer position="top-center" hideProgressBar={true} />
			<ConfigurationHeader />
			<FadeInOnScroll enabled={animationsEnabled}>
				<ConfigurationUploadArquivo
					setFiles={setFiles}
					files={files}
					uploadFiles={uploadFiles}
				/>
				<ConfigurationIntegracaoApi />
				{/* <ConfigurationFooter uploadFiles={uploadFiles} /> */}
			</FadeInOnScroll>
		</div>
	);
};

export default Configuration;
