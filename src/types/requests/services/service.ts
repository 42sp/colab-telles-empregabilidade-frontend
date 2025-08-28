import type { AxiosInstance } from "axios";
import type * as collection from "../index";

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
		// Garante que cada key do params vira query string
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null)
				query.append(key, String(value));
		});

		const response = await this.$axios.get(
			`/students/stats?${query.toString()}`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
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
		if (response?.data?.accessToken) {
			sessionStorage.setItem("accessToken", response.data.accessToken);
		}
		return response;
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
	// -------------------------------------------------------------------- PUT --------------------------------------------------------------------

	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
}
