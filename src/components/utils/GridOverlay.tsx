import { useState } from "react";

interface GridOverlayProps {
	columns?: number; // quantidade de colunas
	rows?: number; // quantidade de linhas
	gap?: number; // gap em pixels
	color?: string; // cor das linhas
}

export const GridOverlay = ({
	columns = 46,
	rows = 12,
	gap = 0,
	color = "rgba(255,0,0,0.3)",
}: GridOverlayProps) => {
	const [showGrid, setShowGrid] = useState(false);

	return (
		<>
			{/* Botão para ativar/desativar */}
			<button
				onClick={() => setShowGrid(!showGrid)}
				className="fixed top-4 right-4 z-50 bg-indigo-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-indigo-700 transition-colors"
			>
				{showGrid ? "Esconder Grid" : "Mostrar Grid"}
			</button>

			{/* Overlay da grid */}
			{showGrid && (
				<div
					className="fixed inset-0 z-40 pointer-events-none"
					style={{
						display: "grid",
						gridTemplateColumns: `repeat(${columns}, 1fr)`,
						gridTemplateRows: `repeat(${rows}, 1fr)`,
						gap: `${gap}px`,
					}}
				>
					{/* linhas e colunas */}
					{Array.from({ length: rows }).map((_, rowIdx) =>
						Array.from({ length: columns }).map((_, colIdx) => (
							<div
								key={`${rowIdx}-${colIdx}`}
								className="w-full h-full"
								style={{
									border: `1px solid ${color}`,
									boxSizing: "border-box",
								}}
							/>
						))
					)}
				</div>
			)}
		</>
	);
};
