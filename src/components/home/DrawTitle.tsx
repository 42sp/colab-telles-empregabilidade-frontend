import type { drawTitleType } from "../../pages/home/types";

export function DrawTitle(props: drawTitleType) {
	return (
		<div className="space-y-1 p-6">
			<h1 className="text-2xl font-bold text-gray-800">{props.title}</h1>
			<p className="text-md text-gray-600">{props.description}</p>
		</div>
	);
}
