import { useCallback, useState } from "react";

interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue as T);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  // Focus and click both select a tab, so repeated selections of the current
  // value are ignored to avoid firing onChange twice for a single interaction.
  const setState = useCallback(
    (next: T) => {
      if (Object.is(next, current)) return;
      if (!isControlled) {
        setInternal(next);
      }
      onChange?.(next);
    },
    [current, isControlled, onChange],
  );

  return [current, setState];
}
