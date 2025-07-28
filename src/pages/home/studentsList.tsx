import { DrawBody } from "./DrawBody";
import { DrawTitle } from "./DrawTitle";

export function StudentsList() {
	return (
		<div className="contain-layout">
			<div className="container flex flex-col min-h-screen w-full">
				<DrawTitle title={"Lista de estudantes"} />
				<DrawBody />
			</div>
		</div>
	);
}
