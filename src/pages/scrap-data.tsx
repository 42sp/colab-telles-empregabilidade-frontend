import { LinkedInAuthForm } from "@/components/scrap-data/LinkedInAuthForm";
import { NewOperationForm } from "@/components/scrap-data/NewOperationForm";
import { ActiveBooking } from "@/components/scrap-data/ActiveBooking";
import { OperationHistory } from "@/components/scrap-data/OperationHistory";
import { FadeInOnScroll } from "@/components/utils/FadeInOnScroll";

function ScrapData() {
	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Scrap Data</h1>
				<p className="text-muted-foreground">
					Agendamento e monitoramento de operações de scraping do LinkedIn
				</p>
			</div>

			<FadeInOnScroll delay={0}>
				<LinkedInAuthForm />
			</FadeInOnScroll>

			<FadeInOnScroll delay={0.1}>
				<NewOperationForm />
			</FadeInOnScroll>

			<FadeInOnScroll delay={0.2}>
				<ActiveBooking />
			</FadeInOnScroll>

			<FadeInOnScroll delay={0.2}>
				<OperationHistory />
			</FadeInOnScroll>
		</div>
	);
}

export default ScrapData;
