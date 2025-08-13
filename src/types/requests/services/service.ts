import type { AxiosInstance } from "axios";
import type * as collection from "../index";

export default class Service {
	$axios: AxiosInstance;

	constructor($axios: AxiosInstance) {
		this.$axios = $axios;
	}

	// -------------------------------------------------------------------- GET --------------------------------------------------------------------

	// -------------------------------------------------------------------- GET --------------------------------------------------------------------

	// -------------------------------------------------------------------- POST --------------------------------------------------------------------
	async postAuthentication(params: collection.AuthenticationParameters) {
		const response = await this.$axios.post<collection.AuthenticationResponse>(
			"/authentication",
			params
		);
		if (response?.data?.accessToken) {
			sessionStorage.setItem("accessToken", response.data.accessToken);
		}
		return response;
	}

	async postImportFiles(params: collection.ImportFilesParameters) {
		const files = params.files.filter(file => file.file instanceof File);
		if (files.length !== params.files.length) {
			throw new Error("Todos os itens devem ser arquivos do tipo File.");
		}

		const responses = await Promise.all(
			files.map(file => {
				const formData = new FormData();
				formData.append("file", file.file);
				return this.$axios.post<collection.ImportFilesResponse>(
					"/import-files",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
			})
		);
		return responses;
	}
	// -------------------------------------------------------------------- POST --------------------------------------------------------------------

	// -------------------------------------------------------------------- PUT --------------------------------------------------------------------
	// -------------------------------------------------------------------- PUT --------------------------------------------------------------------

	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
}
