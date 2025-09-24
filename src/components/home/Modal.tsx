import React from "react";

// import "./style.css";

interface ModalEditProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	title: string;
}

const Modal: React.FC<ModalEditProps> = props => {
	if (!props.isOpen) return null;

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				background: "rgba(0,0,0,0.1)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 10000
			}}
			onClick={props.onClose}
		>
			<div
				style={{
					background: "#fff",
					padding: "24px",
					borderRadius: "8px",
					minWidth: "300px",
					position: "relative",
					width: "80%",
					marginTop: "10px"
				}}
				onClick={e => e.stopPropagation()}
			>
				<div className="flex flex-row justify-between">
					<div></div>
					<h2 className="text-lg font-bold">{props.title}</h2>
					<button
						style={{
							background: "transparent",
							border: "none",
							fontSize: "1.5rem",
							cursor: "pointer",
						}}
						onClick={props.onClose}
						aria-label="Fechar"
					>
						&times;
					</button>
				</div>
				{props.children ?? ""}
			</div>
		</div>
	);
};

export default Modal;
