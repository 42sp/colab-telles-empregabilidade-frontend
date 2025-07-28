import type { drawTitleType } from "./types";

export function DrawTitle(props: drawTitleType) {
	const background: string = "container mx-auto p-6 space-y-8";
	const font: string = "text-2xl font-bold text-gray-800";

	return (
		<div className={background}>
			<h1 className={font}>{props.title}</h1>
		</div>
	);
}
