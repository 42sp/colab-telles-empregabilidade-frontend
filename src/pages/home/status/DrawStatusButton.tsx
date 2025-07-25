import { Button } from "@/components/ui/button";

export function DrawStatusButton(props)
{
	const buttonProps ={
		variant: null,
		size: "default",
	};

	return (
		<div className="flex">
			{props.buttons.map(({label}) => {
				const isActive: boolean = props.activeLabel === label;
				const textColour: string = isActive ? "text-black": "text-zinc-500";
				const buttonStyle: string = `flex items-center gap-2 justify-start font-geist text-base px-4 py-2 ${textColour}`;

				return (
					<Button
						key={label}
						{...buttonProps}
						className={buttonStyle}
						onClick={() => {props.setActiveLabel(label)}}
					>
						{label}
					</Button>
				);
			})}
		</div>
	);
}
