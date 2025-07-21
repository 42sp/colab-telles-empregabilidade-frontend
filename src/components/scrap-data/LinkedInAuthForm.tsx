import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { LinkedInAuth } from "./LinkedInAuth";

const linkedInFormSchema = z.object({
	linkedinUser: z.string().min(1, "Usuário obrigatório"),
	linkedinPassword: z.string().min(1, "Senha obrigatória"),
	linkedinToken: z.string().optional(),
});

type LinkedInFormData = z.infer<typeof linkedInFormSchema>;

export function LinkedInAuthForm() {
	const form = useForm<LinkedInFormData>({
		resolver: zodResolver(linkedInFormSchema),
		defaultValues: {
			linkedinUser: "",
			linkedinPassword: "",
			linkedinToken: "",
		},
	});

	function onSubmit(data: LinkedInFormData) {
		console.log("LinkedIn Auth Data:", data);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<LinkedInAuth />
			</form>
		</Form>
	);
}
