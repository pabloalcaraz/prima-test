import { useState } from "react";

type UseControllableStateProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue as T);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const setState = (next: T) => {
    if (Object.is(next, current)) return;
    if (!isControlled) {
      setInternal(next);
    }
    onChange?.(next);
  };

  return [current, setState];
}
