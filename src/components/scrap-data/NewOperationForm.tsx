import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { NewOperation } from "./NewOperation";

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

	function onSubmit(data: NewOperationData) {
		console.log("New Operation Data:", data);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<NewOperation />
			</form>
		</Form>
	);
}
