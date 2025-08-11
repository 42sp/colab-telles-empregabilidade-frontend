import type { AxiosInstance } from "axios";
import type * as collection from "../index";

export default class Service {
	$axios: AxiosInstance;

	constructor($axios: AxiosInstance) {
		this.$axios = $axios;
	}

	// -------------------------------------------------------------------- GET --------------------------------------------------------------------
	async students(params = {}) {
		const token = sessionStorage.getItem("accessToken");
		if (!token) {
			throw new Error("No access token found");
		}
		const response = await this.$axios.get<collection.StudentsResponse>(
			"/students",
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params,
			}
		);

		return response;
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
	// -------------------------------------------------------------------- POST --------------------------------------------------------------------

	// -------------------------------------------------------------------- PUT --------------------------------------------------------------------
	// -------------------------------------------------------------------- PUT --------------------------------------------------------------------

	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
	// -------------------------------------------------------------------- DELETE --------------------------------------------------------------------
}
