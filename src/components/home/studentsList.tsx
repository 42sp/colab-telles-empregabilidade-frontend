import { FadeInOnScroll } from "../utils/FadeInOnScroll";
import { DrawBody } from "./DrawBody";
import { DrawTitle } from "./DrawTitle";
import { useSidebar } from "@/contexts/SidebarContext";

export function StudentsList() {
	const { animationsEnabled } = useSidebar();

	return (
		<div className="flex flex-col w-full overflow-hidden">
			<DrawTitle
				title={"Lista de estudantes"}
				description={"Gerencie e visualize os alunos registrados."}
			/>
			<FadeInOnScroll enabled={animationsEnabled}>
				<DrawBody />
			</FadeInOnScroll>
		</div>
	);
}
