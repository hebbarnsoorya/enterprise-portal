import { useEffect, useState } from 'react';

/**
 * TAG-CASE#5: Standard Debounce Hook
 * Delays updating a value until the user stops typing for a set duration.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay is over
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}