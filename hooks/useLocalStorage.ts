
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// Fix: Cannot find namespace 'React'. Use imported Dispatch and SetStateAction types.
function useLocalStorage<T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const prefixedKey = `prepHub_${key}`;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore =
        typeof storedValue === 'function'
          ? storedValue(storedValue)
          : storedValue;
      window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [prefixedKey, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;