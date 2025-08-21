// components/scrap-data/ActiveBooking/DeleteButton.tsx
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOperationsActions } from "@/contexts/ScrapOperationsContext";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
	id: number | string;
	name: string;
	deleted_at?: string | null;
	onDeleted?: () => void; // opcional para compatibilidade
};

export function DeleteButton({ id, name, deleted_at, onDeleted }: Props) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const { deleteOperation } = useOperationsActions();

	async function handleDelete() {
		if (!id) return;
		setLoading(true);

		try {
			const success = await deleteOperation(id); // ✅ agora envia deleted_by
			if (success) {
				toast.success(`Operação "${name}" marcada como excluída.`);
				onDeleted?.();
			} else {
				toast.error("Erro ao excluir operação.");
			}
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
							className="hover:bg-red-500 hover:text-white cursor-pointer h-8 w-8"
						>
							{loading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Excluir Operação</p>
						{deleted_at && (
							<p className="text-xs text-gray-400">Deletado em {deleted_at}</p>
						)}
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
