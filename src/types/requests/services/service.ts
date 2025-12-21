import type { AxiosInstance } from "axios";
import * as collection from "../index";
import type { Data } from "@/pages/home/types";

function buildQueryString(params: collection.StudentsType): string {
	const query = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value && typeof value === "object") {
			if ("$in" in value && Array.isArray(value.$in)) {
				value.$in.forEach((item, index) => {
					query.append(`${key}[$in][${index}]`, String(item));
				});
			} else if ("$eq" in value) {
				query.append(`${key}[$eq]`, String(value.$eq));
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

	return query.toString();
}

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
		try {
			const token = sessionStorage.getItem("accessToken");
			if (!token) throw new Error("No access token found");

			const query = buildQueryString(params);
			return await this.$axios.get<collection.StudentsResponse>(
				`/students?${query}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch (error) {
			console.error("Error in students:", error);
			throw error;
		}
	}

	async studentsStats(params: collection.StudentsType = {}) {
		try {
			const token = sessionStorage.getItem("accessToken");
			if (!token) throw new Error("No access token found");

			const query = buildQueryString(params);
			return await this.$axios.get<collection.StudentsStats>(
				`/students-stats?${query}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch (error) {
			console.error("Error in studentsStats:", error);
			throw error;
		}
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
			console.error("Error updating student:", error);
			// throw error;
		}
	}
	// -------------------------------------------------------------------- PUT --------------------------------------------------------------------

	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
	async deleteStudent(studentId: number) {
		try {
			const response = await this.$axios.delete(`/students/${studentId}`);
			return response;
		} catch (error) {
			console.error("Error deleting student:", error);
			throw error;
		}
	}
	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
}
