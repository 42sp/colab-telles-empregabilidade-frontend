import type { fileProps } from "./fileProps";

export interface ImportFilesParameters {
	files: fileProps[];
}

export interface ImportFilesResponse {
	success: boolean;
	message: string;
	importedFiles?: {
		fileName: string;
		status: string;
	}[];
}
