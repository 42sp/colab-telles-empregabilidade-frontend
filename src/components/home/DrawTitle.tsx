import type { drawTitleType } from "../../pages/home/types";

export function DrawTitle(props: drawTitleType) {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800">{props.title}</h1>
			<p className="text-md text-gray-600 flax flex-wrap break-words">
				{props.description}
			</p>
		</div>
	);
}
