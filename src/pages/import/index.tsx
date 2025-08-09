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

const Configuration = () => {
	const [files, setFiles] = useState<fileProps[]>([]);

	const services = useServices();

	const uploadFiles = async () => {
		const response = await services.postImportFiles({ files });

		response.forEach(res => {
			if ([200, 201].includes(res.status)) {
				const message = res.data.message;

				files.forEach(file => {
					if (message.includes(file.name)) {
						file.status = "Sucesso";
					}
				});

				setFiles([...files]);
			}
		});
	};

	return (
		<div>
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
