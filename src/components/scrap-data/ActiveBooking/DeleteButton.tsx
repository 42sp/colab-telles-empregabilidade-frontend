import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { scrapService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
	id?: number;
	uuid: string;
	name: string;
	onDeleted: () => void;
};

export function DeleteButton({ id, uuid, name, onDeleted }: Props) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		setLoading(true);
		try {
			await scrapService.remove(uuid);
			toast.success(`Operação "${name}" excluída com sucesso.`);
			onDeleted();
		} catch (err) {
			console.error(err);
			toast.error("Erro ao excluir operação.");
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}

	return (
		<>
			<TooltipProvider delayDuration={300}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={() => setOpen(true)}
							disabled={loading}
							aria-label={`Excluir agendamento ${name}`}
							className="hover:bg-red-500 hover:text-white cursor-pointer"
						>
							{loading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>{"Excluir Operação"}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<ConfirmDeleteModal
				open={open}
				onClose={() => setOpen(false)}
				onConfirm={handleDelete}
				title={`Excluir "${name}"?`}
			/>
		</>
	);
}
