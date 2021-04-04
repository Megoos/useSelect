import { AsyncSelectExample } from './components/AsyncSelectExample';
import { AutoSelectExample } from './components/AutoSelectExample';

import classes from './Examples.module.scss';

export const Examples = () => {
  return (
    <div className={classes.container}>
      <AutoSelectExample />
      <AsyncSelectExample />
    </div>
  );
};
