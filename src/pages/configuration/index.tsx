import {
	ConfigurationFooter,
	ConfigurationHeader,
	ConfigurationIntegracaoApi,
	ConfigurationUploadArquivo,
} from "@/components/configuration";

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
