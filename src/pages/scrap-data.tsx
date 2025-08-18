import { LinkedInAuthForm } from "@/components/scrap-data/LinkedInAuthForm";
import { NewOperationForm } from "@/components/scrap-data/NewOperation/NewOperationForm";
import { ActiveBooking } from "@/components/scrap-data/ActiveBooking/ActiveBooking";
import { OperationHistory } from "@/components/scrap-data/OperationHistory";
import { FadeInOnScroll } from "@/components/utils/FadeInOnScroll";
import { useSidebar } from "@/contexts/SidebarContext";
import { useEffect, useState } from "react";
import { scrapService } from "@/services/api";
import type { Operation } from '@/types/operations';

function ScrapData() {
	const { animationsEnabled } = useSidebar();
	const [operations, setOperations] = useState<Operation[]>([]);

	useEffect(() => {
		async function fetch() {
			const response = await scrapService.find( { query: { $sort: { scheduled_date: 1 } } });
			const raw = response.data || [];
			setOperations(raw);
		}
		fetch();
	}, [])

	function addOperation(newOp: Operation) {
		setOperations(prev => [newOp, ...prev])
	}

	function removeOperation(uuid: string) {
		setOperations(prev => prev.filter(op => op.uuid !== uuid));
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Scrap Data</h1>
				<p className="text-muted-foreground">
					Agendamento e monitoramento de operações de scraping do LinkedIn
				</p>
			</div>

			<FadeInOnScroll delay={0} enabled={animationsEnabled}>
				<LinkedInAuthForm />
			</FadeInOnScroll>

			<FadeInOnScroll delay={0.1} enabled={animationsEnabled}>
				<NewOperationForm onOperationCreated={addOperation} />
			</FadeInOnScroll>

			<FadeInOnScroll delay={0.2} enabled={animationsEnabled}>
				<ActiveBooking operations={operations} onDeleted={removeOperation} />
			</FadeInOnScroll>

			<FadeInOnScroll delay={0.2} enabled={animationsEnabled}>
				<OperationHistory />
			</FadeInOnScroll>
		</div>
	);
}

export default ScrapData;
