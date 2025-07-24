type drawTitleType = {
	title: string;
};

export function DrawTitle(props: drawTitleType): JSX.Element {
	const background: string =
		"flex flex-wrap bg-white border border-b border-gray-300 px-4 py-4.5 p-4";
	const font: string = "font-bold font-geist  text-black text-2xl";

	return (
		<div className={background}>
			<h1 className={font}>{props.title}</h1>
		</div>
	);
}
