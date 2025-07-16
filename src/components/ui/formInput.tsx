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

// 🎯 Centralize todos os ajustes visuais aqui:
const LABEL_GAP = "gap-4"; // Gap entre label e input
const INPUT_HEIGHT_CLASS = "h-[42px]"; // Altura do input
const INPUT_WIDTH_CLASS = "w-full"; // Largura do input
const INPUT_PADDING_CLASS = "pt-[9px] pb-[7px] pr-[11px]"; // Padding interno do texto do input (sem pl, pois entra condicional)

const ICON_SIZE_CLASS = "w-[20px] h-[20px]"; // Tamanho do ícone
const ICON_POSITION_TOP = "top-[12px]"; // Distância do topo do container
const ICON_LEFT_CLASS = "left-[14px]";
const ICON_RIGHT_CLASS = "right-[11px]";

const INPUT_PADDING_LEFT = "pl-[42px]"; // Espaço total à esquerda para ícone
const INPUT_PADDING_RIGHT = "pr-[42px]"; // Espaço total à direita para ícone

interface FormInputProps {
	name: string;
	label?: string;
	type?: string;
	placeholder?: string;
	iconPrepend?: ReactElement<SVGProps<SVGSVGElement>>;
	iconAppend?: ReactElement<SVGProps<SVGSVGElement>>;
	mask?: string;
}

export function FormInput({
	name,
	label,
	type = "text",
	placeholder,
	iconPrepend,
	iconAppend,
	mask,
}: FormInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const isPasswordField = type === "password";
	const inputType = isPasswordField
		? showPassword
			? "text"
			: "password"
		: type;

	// Classe base do input
	const inputBaseClasses = [
		INPUT_HEIGHT_CLASS,
		INPUT_WIDTH_CLASS,
		INPUT_PADDING_CLASS,
		iconPrepend ? INPUT_PADDING_LEFT : "",
		isPasswordField || iconAppend ? INPUT_PADDING_RIGHT : "",
	].join(" ");

	// Render
	return (
		<FormField
			name={name}
			render={({ field }) => (
				<FormItem className={`flex flex-col ${LABEL_GAP}`}>
					{label && <FormLabel htmlFor={name}>{label}</FormLabel>}

					<FormControl>
						<div className="relative">
							{/* Ícone à esquerda */}
							{iconPrepend && (
								<span
									className={`absolute ${ICON_LEFT_CLASS} ${ICON_POSITION_TOP} text-muted-foreground`}
								>
									{React.isValidElement(iconPrepend)
										? React.cloneElement(iconPrepend, {
												className: ICON_SIZE_CLASS,
											})
										: iconPrepend}
								</span>
							)}

							{/* Input (com ou sem máscara) */}
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

							{/* Botão para senha */}
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
	);
}
