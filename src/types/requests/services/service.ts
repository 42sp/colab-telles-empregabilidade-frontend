import type { AxiosInstance } from "axios";
import * as collection from "../index";

export default class Service {
	$axios: AxiosInstance;

	constructor($axios: AxiosInstance) {
		this.$axios = $axios;
	}

	// -------------------------------------------------------------------- GET --------------------------------------------------------------------
	async getImportedFiles() {
		const response = await this.$axios.get<{
			data: collection.GetImportedFilesResponse[];
		}>("/imported-files", { params: { lastThree: true } });
		return response.data;
	}

	async getLinkedinDashboard() {
		const response =
			await this.$axios.get<collection.GetLinkedinDashboardResponse>(
				"/linkedin/dashboard"
			);

		return response.data;
	}

	async students(params: collection.StudentsType = {}) {
		const token = sessionStorage.getItem("accessToken");
		if (!token) {
			throw new Error("No access token found");
		}

		const query = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value && typeof value === "object") {
				if ("$in" in value && Array.isArray(value.$in)) {
					value.$in.forEach((item, index) => {
						query.append(`${key}[$in][${index}]`, String(item));
					});
				} else if ("$ilike" in value) {
					const like = String(value.$ilike ?? "").trim();
					if (like !== "") query.append(`${key}[$ilike]`, like);
				} else if ("$like" in value) {
					const like = String(value.$like ?? "").trim();
					if (like !== "") query.append(`${key}[$like]`, like);
				}
			} else if (value !== undefined && value !== null) {
				query.append(key, String(value));
			}
		}

		const response = await this.$axios.get<collection.StudentsResponse>(
			`/students?${query.toString()}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response;
	}

	async studentsStats(params: collection.StudentsType = {}) {
		const token = sessionStorage.getItem("accessToken");
		if (!token) throw new Error("No access token found");

		const query = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				query.append(key, String(value));
			}
		});

		const response = await this.$axios.get(
			`/students/stats?${query.toString()}`
		);

		return response.data;
	}

	// -------------------------------------------------------------------- GET --------------------------------------------------------------------

	// -------------------------------------------------------------------- POST --------------------------------------------------------------------
	async postAuthentication(params: collection.AuthenticationParameters) {
		const response = await this.$axios.post<collection.AuthenticationResponse>(
			"/authentication",
			params
		);

		// NÃO salva token aqui — responsabilidade do AuthContext
		// sessionStorage.setItem("accessToken", response.data.accessToken);

		return response; // retorna o objeto completo { accessToken, user }
	}

	async postImportFiles(params: collection.ImportFilesParameters) {
		const formData = new FormData();

		formData.append("file", params.file.file);
		const response = await this.$axios.post<collection.ImportFilesResponse>(
			"/import-files",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response;
	}
	// -------------------------------------------------------------------- POST --------------------------------------------------------------------

	// -------------------------------------------------------------------- PUT --------------------------------------------------------------------
	async putStudents(params: collection.StudentsParameters) {
		try {
			const response = await this.$axios.patch<collection.StudentsParameters>(
				`/students/${params.id}`,
				params
			);

			return response;
		} catch (error) {
			console.error('Error updating student:', error);
			// throw error;
		}
	}
	// -------------------------------------------------------------------- PUT --------------------------------------------------------------------

	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
}
