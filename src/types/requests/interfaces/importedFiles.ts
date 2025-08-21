export interface GetImportedFilesResponse {
	id: number;
	fileName: string;
	importationDate: Date;
	userId: string;
	user: {
		id: string;
		created_at: Date;
		name: string;
		email: string;
	};
}
