import React, { useState } from "react";
import type { ReactElement, SVGProps } from "react";
import InputMask from "react-input-mask";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

// 🎯 Ajustes visuais centralizados
const LABEL_GAP = "gap-4";
const INPUT_HEIGHT_CLASS = "h-[42px]";
const INPUT_PADDING_CLASS = "pt-[9px] pb-[7px] pr-[11px]";
const ICON_SIZE_CLASS = "w-[20px] h-[20px]";
const ICON_POSITION_TOP = "top-[12px]";
const ICON_LEFT_CLASS = "left-[14px]";
const ICON_RIGHT_CLASS = "right-[11px]";
const INPUT_PADDING_LEFT = "pl-[42px]";
const INPUT_PADDING_RIGHT = "pr-[42px]";

interface FormInputProps {
	name: string;
	label?: string;
	type?: string;
	placeholder?: string;
	iconPrepend?: ReactElement<SVGProps<SVGSVGElement>>;
	iconAppend?: ReactElement<SVGProps<SVGSVGElement>>;
	mask?: string;
	wrapperClassName?: string;
	inputClassName?: string;
}

export function FormInput({
	name,
	label,
	type = "text",
	placeholder,
	iconPrepend,
	iconAppend,
	mask,
	wrapperClassName = "",
	inputClassName = "",
}: FormInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const isPasswordField = type === "password";
	const inputType = isPasswordField
		? showPassword
			? "text"
			: "password"
		: type;

	const isDateOrTime = type === "date" || type === "time";

	const inputBaseClasses = [
		INPUT_HEIGHT_CLASS,
		INPUT_PADDING_CLASS,
		iconPrepend ? INPUT_PADDING_LEFT : "",
		isPasswordField || iconAppend ? INPUT_PADDING_RIGHT : "",
		inputClassName,
	].join(" ");

	return (
		<>
			<style>{`
				/* Área clicável do seletor nativo aumentada e centralizada */
				input[type="date"]::-webkit-calendar-picker-indicator,
				input[type="time"]::-webkit-calendar-picker-indicator {
					position: absolute;
					width: 28px;
					height: 28px;
					left: 9px;
					top: 8px;
					opacity: 0;
					cursor: pointer;
					z-index: 10;
				}

				/* Apenas para inputs date/time com a classe */
				.date-time-picker-wrapper:hover::before {
					content: "";
					position: absolute;
					left: 9px;
					top: 8px;
					width: 28px;
					height: 28px;
					background-color: rgba(156, 163, 175, 0.2);
					border-radius: 0.25rem;
					pointer-events: none;
					z-index: 9;
					transition: all 0.15s ease-in-out;
					box-shadow: 0 4px 6px rgba(0,0,0,0.1);
					transform: translateY(-2px);
				}
			`}</style>

			<FormField
				name={name}
				render={({ field }) => (
					<FormItem
						className={`flex flex-col ${LABEL_GAP} ${wrapperClassName}`}
					>
						{label && <FormLabel htmlFor={name}>{label}</FormLabel>}

						<FormControl>
							{/* Só coloca essa classe se for input date/time */}
							<div
								className={`relative ${isDateOrTime && iconPrepend ? "date-time-picker-wrapper" : ""}`}
							>
								{/* Ícone à esquerda customizado */}
								{iconPrepend && (
									<span
										className={`absolute ${ICON_LEFT_CLASS} ${ICON_POSITION_TOP} text-muted-foreground pointer-events-none`}
									>
										{React.isValidElement(iconPrepend)
											? React.cloneElement(iconPrepend, {
													className: ICON_SIZE_CLASS,
												})
											: iconPrepend}
									</span>
								)}

								{/* Input ou Input com máscara */}
								{mask ? (
									<InputMask
										mask={mask}
										{...field}
										onChange={field.onChange}
										value={field.value || ""}
									>
										{(
											inputProps: React.InputHTMLAttributes<HTMLInputElement>
										) => (
											<Input
												{...inputProps}
												id={name}
												type={inputType}
												placeholder={placeholder}
												className={inputBaseClasses}
											/>
										)}
									</InputMask>
								) : (
									<Input
										{...field}
										id={name}
										type={inputType}
										placeholder={placeholder}
										className={inputBaseClasses}
									/>
								)}

								{/* Botão de mostrar senha */}
								{isPasswordField && (
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className={`absolute ${ICON_RIGHT_CLASS} ${ICON_POSITION_TOP} text-muted-foreground`}
										tabIndex={-1}
									>
										{showPassword ? (
											<EyeOff className={ICON_SIZE_CLASS} />
										) : (
											<Eye className={ICON_SIZE_CLASS} />
										)}
									</button>
								)}

								{/* Ícone à direita customizado */}
								{!isPasswordField && iconAppend && (
									<span
										className={`absolute ${ICON_RIGHT_CLASS} ${ICON_POSITION_TOP} text-muted-foreground`}
									>
										{React.isValidElement(iconAppend)
											? React.cloneElement(iconAppend, {
													className: ICON_SIZE_CLASS,
												})
											: iconAppend}
									</span>
								)}
							</div>
						</FormControl>

						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
