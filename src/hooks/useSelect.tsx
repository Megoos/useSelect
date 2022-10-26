import { useEffect, useRef, useState } from 'react';

export interface UseSelectProps<T> {
  //** Список вариантов выбора */
  options: T[];
  //** Содержимое поля по умолчанию */
  defaultValue?: T;
  //** Селектор для лейбла в поле ввода */
  getOptionLabel: (option: T) => string;
  //** Обработчик изменения значения 'inputValue' */
  onInputChange?: (value: string) => void;
  //** Обработчик изменения значения 'value' */
  onChange?: (value: T | null) => void;
  //** Фильтр для опций */
  filterOptions?: (option: T, value: string) => boolean;
}

export function useSelect<T>({
  options: optionsProps,
  defaultValue,
  getOptionLabel,
  onInputChange,
  onChange,
  filterOptions,
}: UseSelectProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValueState] = useState<T | null>(defaultValue || null);
  const [inputValue, setInputValueState] = useState(defaultValue ? getOptionLabel(defaultValue) : '');
  const [isOpen, setIsOpenState] = useState(false);
  const [options, setOptionsState] = useState<T[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (filterOptions) {
        setOptionsState(optionsProps.filter((value) => filterOptions(value, inputValue)));
      } else {
        setOptionsState(optionsProps);
      }
    } else {
      setOptionsState([]);
    }
  }, [isOpen, inputValue, optionsProps, filterOptions]);

  const handleInputValue = (newValue: T | null) => {
    let newInputValue;
    if (newValue === null) {
      newInputValue = '';
    } else {
      newInputValue = getOptionLabel(newValue);
    }

    if (inputValue === newInputValue) {
      return;
    }

    setInputValueState(newInputValue);

    if (onInputChange) {
      onInputChange(newInputValue);
    }
  };

  const handleValue = (newValue: T | null) => {
    if (value === newValue) {
      return;
    }

    if (onChange) {
      onChange(newValue);
    }

    setValueState(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (inputValue !== newValue) {
      setInputValueState(newValue);

      if (onInputChange) {
        onInputChange(newValue);
      }
    }

    if (newValue === '') {
      handleValue(null);
    }

    if (!isOpen) {
      setIsOpenState(true);
    }
  };

  const handleFocus = () => {
    setIsOpenState(true);
  };

  const handleBlur = () => {
    handleInputValue(value);
    setIsOpenState(false);
  };

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const handleOptionClick = (event: React.ChangeEvent<any>) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    const newOption = options[index];

    handleValue(newOption);
    handleInputValue(newOption);
    setIsOpenState(false);
  };

  const handleInputMouseDown = () => {
    if (!isOpen) {
      setIsOpenState(true);
    }
  };

  return {
    rootProps: () => ({
      onClick: handleClick,
    }),
    inputProps: () => ({
      value: inputValue,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onMouseDown: handleInputMouseDown,
      onChange: handleInputChange,
      ref: inputRef,
    }),
    listboxProps: () => ({
      onMouseDown: (event: React.ChangeEvent<any>) => {
        event.preventDefault();
      },
    }),
    optionProps: ({ index }: { index: number }) => {
      return {
        tabIndex: -1,
        onClick: handleOptionClick,
        'data-index': index,
      };
    },
    isOpen,
    options,
    inputValue,
  };
}
