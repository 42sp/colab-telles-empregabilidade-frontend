import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { NewOperation } from "./NewOperation";
import { scrapService } from '@/services/api';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const newOperationSchema = z.object({
	date: z.string().min(1, "Data obrigatória"),
	time: z.string().min(1, "Hora obrigatória"),
	name: z.string().min(1, "Nome da operação obrigatório"),
});

type NewOperationData = z.infer<typeof newOperationSchema>;

export function NewOperationForm() {
	const form = useForm<NewOperationData>({
		
		resolver: zodResolver(newOperationSchema),
		defaultValues: {
			date: "",
			time: "",
			name: "",
		},
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function onSubmit(data: NewOperationData) {
		try {
		setIsSubmitting(true);

		const payload = {
			name: data.name,
			user_tag: 'admin',
			scheduled_date: data.date,
			scheduled_time: data.time,
			type: 'LinkedIn'
		};

		const response = await scrapService.create(payload);
		toast.success('Operação agendada com sucesso!');

		console.log('Criado:', response);
		form.reset();
		} catch (err: any) {
			console.error('Erro ao criar operação:', err);
			toast.error('Falha ao agendar operação:');
		} finally {
			setIsSubmitting(false);
		}

	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<NewOperation isSubmitting={isSubmitting}/>
			</form>
		</Form>
	);
}
