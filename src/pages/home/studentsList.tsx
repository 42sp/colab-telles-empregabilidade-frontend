import { DrawBody } from "./DrawBody";
import { DrawTitle } from "./DrawTitle";

export function StudentsList() {
	return (
		<div className="flex flex-col w-full space-y-6-1">
			<DrawTitle
				title={"Lista de estudantes"}
				description={"Gerencie e visualize os alunos registrados."}
			/>
			<DrawBody />
		</div>
	);
}
