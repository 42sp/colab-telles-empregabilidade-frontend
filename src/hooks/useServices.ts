import Service from "@/types/requests/services/service";
import { useAxios } from "./useAxios";

export const useServices = () => {
	const { instance } = useAxios();

	return new Service(instance);
};
