import { DrawBody } from "./DrawBody";
import { DrawTitle } from "./DrawTitle";

export function	StudentsList()
{
	return (
		<div className="flex flex-col flex-wrap min-h-screen w-full">
			<DrawTitle title={"Lista de estudantes"} />
			<DrawBody />
		</div>
	);
}
