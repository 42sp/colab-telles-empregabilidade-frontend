import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { LinkedInAuth } from "@/components/scrap-data/LinkedInAuth";
import { NewOperation } from "@/components/scrap-data/NewOperation";
import { ActiveBooking } from "@/components/scrap-data/ActiveBooking";
import { OperationHistory } from "@/components/scrap-data/OperationHistory";

// LinkedIn Auth Schema
const linkedInFormSchema = z.object({
	linkedinUser: z.string().min(1, "Usuário obrigatório"),
	linkedinPassword: z.string().min(1, "Senha obrigatória"),
	linkedinToken: z.string().optional(),
});

// New Operation Schema
const newOperationSchema = z.object({
	date: z.string().min(1, "Data obrigatória"),
	time: z.string().min(1, "Hora obrigatória"),
	name: z.string().min(1, "Nome da operação obrigatório"),
});

// Combined Schema Type
type LinkedInFormData = z.infer<typeof linkedInFormSchema>;
type NewOperationData = z.infer<typeof newOperationSchema>;

function ScrapData() {
	// LinkedIn Auth Form
	const linkedInForm = useForm<LinkedInFormData>({
		resolver: zodResolver(linkedInFormSchema),
		defaultValues: {
			linkedinUser: "",
			linkedinPassword: "",
			linkedinToken: "",
		},
	});

	// New Operation Form
	const newOpForm = useForm<NewOperationData>({
		resolver: zodResolver(newOperationSchema),
		defaultValues: {
			date: "",
			time: "",
			name: "",
		},
	});

	function onLinkedInSubmit(data: LinkedInFormData) {
		console.log("LinkedIn Auth Data:", data);
	}

	function onNewOpSubmit(data: NewOperationData) {
		console.log("New Operation Data:", data);
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">Scrap Data</h1>
				<p className="text-muted-foreground">
					Agendamento e monitoramento de operações de scraping do LinkedIn
				</p>
			</div>

			<Form {...linkedInForm}>
				<form
					onSubmit={linkedInForm.handleSubmit(onLinkedInSubmit)}
					className="space-y-6"
				>
					<LinkedInAuth />
				</form>
			</Form>

			<Form {...newOpForm}>
				<form
					onSubmit={newOpForm.handleSubmit(onNewOpSubmit)}
					className="space-y-6"
				>
					<NewOperation />
				</form>
			</Form>

			<ActiveBooking />
			<OperationHistory />
		</div>
	);
}

export default ScrapData;
