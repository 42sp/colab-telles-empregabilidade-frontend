import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FieldProps {
	id: string;
	className?: string;
	label?: string;
	type?: string;
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	iconPrepend?: string;
	iconAppend?: string;
	onIconPrependClick?: () => void;
}

const Field = (props: FieldProps) => {
	return (
		<div
			className={`"grid w-full max-w-sm items-center gap-3 ${props.className}`}
		>
			<Label htmlFor={props.id}>{props.label}</Label>
			<div className="relative">
				{props.iconPrepend && (
					<span className="absolute inset-y-0 left-0 flex items-center pl-3">
						<img
							src={props.iconPrepend}
							alt="Icon Prepend"
							className=""
							onChange={props.onIconPrependClick}
						/>
					</span>
				)}
				<Input
					type={props.type}
					id={props.id}
					placeholder={props.placeholder}
					className={`${props.iconPrepend ? "pl-10" : ""}`}
				/>
				{props.iconAppend && (
					<span className="absolute inset-y-0 right-0 flex items-center pr-3">
						<img src={props.iconAppend} alt="Icon Append" className="" />
					</span>
				)}
			</div>
		</div>
	);
};

export { Field };
