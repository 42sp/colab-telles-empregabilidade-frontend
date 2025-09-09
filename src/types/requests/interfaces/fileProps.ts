export interface fileProps {
	id: string;
	status: string;
	lastModified: number;
	name: string;
	userName?: string;

	file: File;
}
