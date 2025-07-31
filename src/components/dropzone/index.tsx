import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import IconsSvg from "@/utils/IconsSvg";

interface DropzoneProps {
	className?: string;
	textClassName?: string;
	onClick?: () => void;
}

const Dropzone = (props: DropzoneProps) => {
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		console.log("Accepted files:", acceptedFiles);
		// const response = await $axios.get("/users");
		// const file = acceptedFiles[0];
		// if (file) {
		// 	const stream = file.stream();
		// 	const reader = stream.getReader();
		// 	async function readChunks() {
		// 		let result = await reader.read();
		// 		while (!result.done) {
		// 			const chunk = result.value;
		// 			// console.log("Chunk received:", chunk);
		// 			result = await reader.read();
		// 		}
		// 	}
		// 	readChunks();
		// }
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"text/csv": [".csv"],
			"application/vnd.ms-excel": [".xls"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
				".xlsx",
			],
		},
	});

	return (
		<div {...getRootProps()} className={props.className}>
			<input {...getInputProps()} />
			{isDragActive ? (
				<p className={props.textClassName}>Solte o arquivo aqui...</p>
			) : (
				<div>
					<img src={IconsSvg.upload} alt="Upload" className="mx-auto mb-2" />
					<p className={props.textClassName}>
						Arraste e solte o arquivo aqui ou clique para selecionar
					</p>
					<p className={`${props.textClassName} text-sm text-gray-300`}>
						Formatos aceitos: CSV, XLS, XLSX (máx. 10MB)
					</p>
				</div>
			)}
		</div>
	);
};

export { Dropzone };
