import { useState, useEffect, Dispatch, SetStateAction } from "react";

/**
 * A hook for syncing a state with localStorage.
 *
 * It works just like `useState`.
 *
 * @template T The type of the value to be stored.
 * @param key The key used to store the value in localStorage.
 * @param initialValue The initial value to use if no value is found in localStorage.
 * @returns A tuple containing the current state value and a function to update it.
 */
function useLocalStorageAsState<T>(
	key: string,
	initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
	// Conserve the state of the value
	const [value, setValue] = useState<T>(() => {
		try {
			const storedValue = localStorage.getItem(key);
			if (storedValue) {
				return JSON.parse(storedValue);
			}
		} catch (error) {
			console.error(
				`Error parsing key "${key}" from localStorage:`,
				error
			);
		}
		return initialValue;
	});

	// Synchronize the state with localStorage whenever the key or value changes
	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error writing key "${key}" to localStorage:`, error);
		}
	}, [key, value]);

	return [value, setValue] as const;
}

export default useLocalStorageAsState;
