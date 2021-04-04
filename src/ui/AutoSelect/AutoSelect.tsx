import { useSelect, UseSelectProps } from 'hooks/useSelect';

import classes from './AutoSelect.module.scss';

interface AutoSelectProps<T> extends UseSelectProps<T> {}

export const AutoSelect = <T,>(props: AutoSelectProps<T>) => {
  const { rootProps, inputProps, listboxProps, optionProps, isOpen, options } = useSelect(props);

  return (
    <div className={classes.container}>
      <div {...rootProps()}>
        <input className={classes.input} {...inputProps()} />
      </div>
      {isOpen && (
        <ul className={classes.listbox} {...listboxProps()}>
          {options.map((option, index) => (
            <li key={props.getOptionLabel(option)} className={classes.option} {...optionProps({ index })}>
              {props.getOptionLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
