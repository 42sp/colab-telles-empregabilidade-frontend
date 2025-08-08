import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
};

export function ConfirmDeleteModal({ open, onClose, onConfirm, title }: Props) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title || "Confirmar exclusão"}</DialogTitle>
					<DialogDescription>
						Você tem certeza que deseja excluir esta operação? Essa ação não
						pode ser desfeita.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="mt-4">
					<Button variant="ghost" onClick={onClose}>
						Cancelar
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Excluir
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
