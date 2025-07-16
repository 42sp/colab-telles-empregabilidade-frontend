import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./style.css";

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
	onIconAppendClick?: () => void;
}

const Field = (props: FieldProps) => {
	return (
		<div className={`field-container ${props.className}`}>
			<Label htmlFor={props.id}>{props.label}</Label>
			<div className="relative">
				{props.iconPrepend && (
					<span className="prependIcon">
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
					<span className="appendIcon">
						<img
							src={props.iconAppend}
							alt="Icon Append"
							className=""
							onChange={props.onIconAppendClick}
						/>
					</span>
				)}
			</div>
		</div>
	);
};

export { Field };
