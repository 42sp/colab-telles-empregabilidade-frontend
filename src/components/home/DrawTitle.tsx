import type { drawTitleType } from "../../pages/home/types";

export function DrawTitle(props: drawTitleType) {
	const background: string = "p-6 space-y-1";
	const font: string = "text-2xl font-bold text-gray-800";

	return (
		<div className={background}>
			<h1 className={font}>{props.title}</h1>
			<p className="text-md text-gray-600">{props.description}</p>
		</div>
	);
}
