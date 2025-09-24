export function loadFromSession(key: string, fallback: T): T {
	const saved = sessionStorage.getItem(key);

	if (saved) {
		try {
			return JSON.parse(saved) as T;
		} catch (error) {
			console.error(`Error loading ${key} from sessionStorage:`, error);
		}
	}
	return fallback;
}
