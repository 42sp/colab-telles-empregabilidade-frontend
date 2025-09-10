import { Button } from "@/components/ui/button";
import type { Data } from "@/pages/home/types";
import type { Dispatch, SetStateAction } from "react";

interface MyButtontype {
	label: string;
}

interface DrawStatusButtonType {
	buttons: MyButtontype[];
	activeLabel: string;
	setActiveLabel: Dispatch<SetStateAction<string>>;
	filteredRows: Data[];
}

export function DrawStatusButton(props: DrawStatusButtonType) {
	const buttonProps = {
		variant: null,
		size: "default",
	} as const;

	return (
		<div className="contain-layout container flex">
			{props.buttons.map(({ label }) => {
				const isActive: boolean = props.activeLabel === label;
				const textColour: string = isActive ? "text-black" : "text-zinc-500";
				const buttonStyle: string = `flex items-center gap-2 justify-start font-geist text-base px-4 py-2 ${textColour}`;

				return (
					<Button
						key={label}
						{...buttonProps}
						className={buttonStyle}
						onClick={() => {
							props.setActiveLabel(label);
						}}
					>
						{label}
					</Button>
				);
			})}
		</div>
	);
}
