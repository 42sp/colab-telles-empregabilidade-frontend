import {
	ConfigurationFooter,
	ConfigurationHeader,
	ConfigurationIntegracaoApi,
	ConfigurationUploadArquivo,
} from "@/components/import";
import { FadeInOnScroll } from "@/components/utils/FadeInOnScroll";

const Configuration = () => {
	return (
		<div>
			<ConfigurationHeader />
			<FadeInOnScroll>
				<ConfigurationUploadArquivo />
			</FadeInOnScroll>
			<FadeInOnScroll>
				<ConfigurationIntegracaoApi />
			</FadeInOnScroll>
			<FadeInOnScroll>
				<ConfigurationFooter />
			</FadeInOnScroll>
		</div>
	);
};

export default Configuration;
