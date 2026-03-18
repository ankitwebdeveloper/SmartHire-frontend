import { useEffect, useRef, useState } from 'react';

function readJson(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallbackValue;
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

export default function useLocalStorageState(key, initialValue) {
  const initialRef = useRef(true);
  const [value, setValue] = useState(() => readJson(key, initialValue));

  useEffect(() => {
    // Avoid writing immediately if localStorage already had something
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / serialization issues
    }
  }, [key, value]);

  return [value, setValue];
}

