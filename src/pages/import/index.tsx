import {
	ConfigurationFooter,
	ConfigurationHeader,
	ConfigurationIntegracaoApi,
	ConfigurationUploadArquivo,
} from "@/components/import";

const Configuration = () => {
	return (
		<div>
			<ConfigurationHeader />
			<ConfigurationUploadArquivo />
			<ConfigurationIntegracaoApi />
			<ConfigurationFooter />
		</div>
	);
};

export default Configuration;
