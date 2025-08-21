import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import IconsSvg from "@/utils/IconsSvg";
import type { fileProps } from "@/types/requests/interfaces/fileProps";
import { v4 as uuidv4 } from "uuid";

interface DropzoneProps {
	className?: string;
	textClassName?: string;
	onClick?: () => void;
	setFiles: React.Dispatch<React.SetStateAction<fileProps[]>>;
}

const Dropzone = (props: DropzoneProps) => {
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		acceptedFiles.forEach(file => {
			const fileWithStatus: fileProps = {
				status: "Pendente",
				lastModified: file.lastModified,
				name: file.name,
				id: uuidv4(),
				file: file,
			};
			props.setFiles(prevFiles => [...prevFiles, fileWithStatus]);
		});
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
