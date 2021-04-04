import React, { useCallback, useRef, useState } from 'react';

export interface UseSelectProps<T> {
  options: T[];
  defaultValue?: T;
  inputValue?: string;
  getOptionLabel: (option: T) => string;
  onInputChange?: (value: string) => void;
  onChange?: (value: T | null) => void;
  filterOptions?: (option: T, value: string) => boolean;
}

export function useSelect<T>({
  options,
  defaultValue,
  inputValue: inputValueProp,
  getOptionLabel,
  onInputChange,
  onChange,
  filterOptions,
}: UseSelectProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValueState] = useState(inputValueProp || '');
  const [value, setValueState] = useState<T | null>(defaultValue || null);
  const [isOpen, setIsOpenState] = useState(false);

  const optionsFilter = useCallback(() => {
    if (filterOptions) {
      return options.filter((value) => filterOptions(value, inputValue));
    } else {
      return options;
    }
  }, [options, inputValue, filterOptions]);

  const handleInputValue = useCallback(
    (newValue: T | null) => {
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
    },
    [inputValue, getOptionLabel, onInputChange]
  );

  const handleValue = useCallback(
    (newValue: T | null) => {
      if (value === newValue) {
        return;
      }

      if (onChange) {
        onChange(newValue);
      }

      setValueState(newValue);
    },
    [value, onChange]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [inputValue, isOpen, onInputChange, handleValue]
  );

  const handleFocus = useCallback(() => {
    setIsOpenState(true);
  }, []);

  const handleBlur = useCallback(() => {
    handleInputValue(value);
    setIsOpenState(false);
  }, [value, handleInputValue]);

  const handleClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleOptionClick = useCallback(
    (event: React.ChangeEvent<any>) => {
      const index = Number(event.currentTarget.getAttribute('data-index'));
      const newOption = optionsFilter()[index];

      handleValue(newOption);
      handleInputValue(newOption);
      setIsOpenState(false);
    },
    [handleValue, handleInputValue, optionsFilter]
  );

  const handleInputMouseDown = useCallback(() => {
    if (!isOpen) {
      setIsOpenState(true);
    }
  }, [isOpen]);

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
    options: optionsFilter(),
    inputValue,
  };
}