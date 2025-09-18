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
}: {
	className?: string;
	placeholder?: string;
	type?: string;
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	required?: boolean;
	onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}) {
	const [isFocused, setIsFocused] = useState(false);

	const isActive = isFocused || (value ?? "").length > 0;

	const inputType = "text";

	return (
		<div className="relative field">
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
          peer w-full p-2 pt-5 pb-1 rounded-md bg-slate-100 pr-10
          text-black placeholder-transparent
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
            absolute left-2 px-1 text-black bg-slate-100 transition-all duration-200 
            pointer-events-none
            ${isActive ? "top-1 text-xs scale-90" : "top-3 text-base"}
          `}
				>
					{placeholder}
				</label>
			)}
		</div>
	);
}
