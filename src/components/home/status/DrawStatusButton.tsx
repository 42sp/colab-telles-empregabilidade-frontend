import { Button } from "@/components/ui/button";
import type { StateBundle } from "@/pages/home/types";

interface MyButtontype {
	label: string;
}

export function DrawStatusButton({
	states,
	buttons,
}: {
	states: StateBundle;
	buttons: MyButtontype[];
}) {
	const buttonProps = {
		variant: null,
		size: "default",
	} as const;

	return (
		<div className="contain-layout container flex">
			{buttons.map(({ label }) => {
				const isActive: boolean = states.activeLabel === label;
				const textColour: string = isActive ? "text-black" : "text-zinc-500";
				const buttonStyle: string = `flex items-center gap-2 justify-start font-geist text-base px-4 py-2 ${textColour}`;

				return (
					<Button
						key={label}
						{...buttonProps}
						className={buttonStyle}
						onClick={() => {
							states.setActiveLabel(label);
						}}
					>
						{label}
					</Button>
				);
			})}
		</div>
	);
}
