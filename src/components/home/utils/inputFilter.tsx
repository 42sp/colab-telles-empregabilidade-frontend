import type { LucideIcon } from "lucide-react";
import React, { useState } from "react";

export function InputFilter({
	className = "",
	placeholder = "",
	type = "text",
	value,
	onChange,
	required,
	onPaste,
	onKeyDown,
	Icon,
}: {
	className?: string;
	placeholder?: string;
	type?: string;
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	required?: boolean;
	onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	Icon?: LucideIcon;
}) {
	const [isFocused, setIsFocused] = useState(false);

	const isActive = isFocused || (value ?? "").length > 0;

	const inputType = type;

	return (
		<div className="relative field">
			{Icon && (
				<Icon className="absolute top-1/2 left-2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none border-r border-slate-200 p-0.5" />
			)}
			<input
				name={placeholder?.toLowerCase()}
				id={placeholder}
				type={inputType}
				value={value}
				onChange={onChange}
				required={required}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder=" "
				autoCapitalize="off"
				data-testid={`input-${placeholder?.toLowerCase()}`}
				className={`
          peer w-full pl-10 p-2 pt-4 rounded-md bg-white pr-10
          text-black placeholder-transparent border border-slate-300
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className}
        `}
				onPaste={onPaste}
				onKeyDown={onKeyDown}
			/>

			{/* Label flutuante */}
			{placeholder && (
				<label
					htmlFor={placeholder}
					className={`
            absolute px-1 transition-all duration-200 
            pointer-events-none left-10 text-slate-500 truncate max-w-[calc(100%-2.5rem)]
            ${isActive ? "top-1 text-xs scale-90" : "top-3.5 text-base"}
          `}
				>
					{placeholder}
				</label>
			)}
		</div>
	);
}
