import { useState } from "react";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

interface UseAxiosResult<T = unknown> {
	loading: boolean;
	error: unknown;
	data: T | null;
	get: (
		url: string,
		params?: Record<string, unknown>,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T> | void>;
	post: <D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T> | void>;
	put: <D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T> | void>;
	del: (
		url: string,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T> | void>;
	instance: AxiosInstance;
}

export function useAxios<T = unknown>(): UseAxiosResult<T> {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown>(null);
	const [data, setData] = useState<T | null>(null);

	async function handleRequest(requestFn: () => Promise<AxiosResponse<T>>) {
		setLoading(true);
		setError(null);
		setData(null);
		try {
			const response = await requestFn();
			setData(response.data);
			return response;
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}

	let baseURL =
		process.env.NODE_ENV === "development"
			? "http://localhost:3030"
			: "https://colab-telles-empregabilidade-backend.onrender.com";

	if (
		window.location.href.indexOf(
			"colab-telles-empregabilidade-frontend.onrender.com"
		) >= 0
	) {
		baseURL = "https://colab-telles-empregabilidade-backend.onrender.com";
	}

	const instance = axios.create({
		baseURL,
	});

	// Adiciona o accessToken do sessionStorage no header Authorization
	instance.interceptors.request.use(config => {
		const token = sessionStorage.getItem("accessToken");
		if (token) {
			config.headers = config.headers || {};
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	});

	const get = (
		url: string,
		params?: Record<string, unknown>,
		config?: AxiosRequestConfig
	) => {
		return handleRequest(() => instance.get<T>(url, { params, ...config }));
	};

	const post = <D = unknown>(
		url: string,
		postData?: D,
		config?: AxiosRequestConfig
	) => {
		return handleRequest(() => instance.post<T>(url, postData, config));
	};

	const put = <D = unknown>(
		url: string,
		putData?: D,
		config?: AxiosRequestConfig
	) => {
		return handleRequest(() => instance.put<T>(url, putData, config));
	};

	const del = (url: string, config?: AxiosRequestConfig) => {
		return handleRequest(() => instance.delete<T>(url, config));
	};

	return { loading, error, data, get, post, put, del, instance };
}
