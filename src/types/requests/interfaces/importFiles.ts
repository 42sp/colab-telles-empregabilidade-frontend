import type { fileProps } from "./fileProps";

export interface ImportFilesParameters {
	file: fileProps;
}

export interface ImportFilesResponse {
	success: boolean;
	message: string;
	importedFiles?: {
		fileName: string;
		status: string;
	}[];
}
