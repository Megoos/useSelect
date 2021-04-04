import { useEffect, useState } from 'react';
import { useSelect, UseSelectProps } from './useSelect';

export interface UseAsyncSelectProps<T> extends Omit<UseSelectProps<T>, 'options'> {
  //** Функция для получения вариантов выбора */
  loadOptions: (inputValue: string) => Promise<T[]>;
}

export function useAsyncSelect<T>({ loadOptions, ...props }: UseAsyncSelectProps<T>) {
  const [options, setOptionsState] = useState<T[]>([]);
  const [loading, setLoadingState] = useState(false);
  const selectState = useSelect({
    ...props,
    options,
  });

  useEffect(() => {
    let active = true;

    if (selectState.isOpen) {
      (async () => {
        setLoadingState(true);

        const response = await loadOptions(selectState.inputValue);

        if (active) {
          setOptionsState(response);
          setLoadingState(false);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [selectState.isOpen, selectState.inputValue, loadOptions]);

  return {
    ...selectState,
    loading,
  };
}
