import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { LinkedInAuth } from "@/components/scrap-data/LinkedInAuth";
import { NewOpForm } from "@/components/scrap-data/NewOpForm";
import { ActiveBooking } from "@/components/scrap-data/ActiveBooking";
import { OpHistory } from "@/components/scrap-data/OpHistory";

// 1. Schema de validação com Zod
const linkedInFormSchema = z.object({
	linkedinUser: z.string().min(1, "Usuário obrigatório"),
	linkedinPassword: z.string().min(1, "Senha obrigatória"),
	linkedinToken: z.string().optional(),
});

// 2. Tipagem inferida a partir do schema
type LinkedInFormData = z.infer<typeof linkedInFormSchema>;

function ScrapData() {
	// 3. Instância do form
	const form = useForm<LinkedInFormData>({
		resolver: zodResolver(linkedInFormSchema),
		defaultValues: {
			linkedinUser: "",
			linkedinPassword: "",
			linkedinToken: "",
		},
	});

	function onSubmit(data: LinkedInFormData) {
		console.log("Dados enviados do LinkedInAuth:", data);
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Scrap Data</h1>
				<p className="text-muted-foreground">
					Agendamento e monitoramento de operações de scraping do LinkedIn
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<LinkedInAuth />
				</form>
			</Form>

			<NewOpForm />
			<ActiveBooking />
			<OpHistory />
		</div>
	);
}

export default ScrapData;
