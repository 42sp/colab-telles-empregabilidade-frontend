import { FadeInOnScroll } from "../utils/FadeInOnScroll";
import { DrawBody } from "./DrawBody";
import { DrawTitle } from "./DrawTitle";

export function StudentsList() {
	return (
		<div className="flex flex-col w-full overflow-hidden">
			<DrawTitle
				title={"Lista de estudantes"}
				description={"Gerencie e visualize os alunos registrados."}
			/>
			<FadeInOnScroll>
				<DrawBody />
			</FadeInOnScroll>
		</div>
	);
}
