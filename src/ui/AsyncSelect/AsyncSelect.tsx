import { useAsyncSelect, UseAsyncSelectProps } from 'hooks/useAsyncSelect';

import classes from './AsyncSelect.module.scss';

interface AsyncSelectProps<T> extends UseAsyncSelectProps<T> {}

export const AsyncSelect = <T,>(props: AsyncSelectProps<T>) => {
  const { rootProps, inputProps, listboxProps, optionProps, isOpen, options, loading } = useAsyncSelect(props);

  return (
    <div className={classes.container}>
      <div {...rootProps()}>
        <input className={classes.input} {...inputProps()} />
      </div>
      {isOpen && (
        <ul className={classes.listbox} {...listboxProps()}>
          {loading ? (
            <li className={classes.loading}>loading...</li>
          ) : (
            options.map((option, index) => (
              <li key={props.getOptionLabel(option)} className={classes.option} {...optionProps({ index })}>
                {props.getOptionLabel(option)}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
