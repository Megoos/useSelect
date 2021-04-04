import { AsyncSelect } from 'ui/AsyncSelect';
import { colors } from 'data/colors';

const filterColors = (inputValue: string) => {
  return colors.filter((i) => i.title.toLowerCase().includes(inputValue.toLowerCase()));
};

const loadOptions = (inputValue: string): Promise<ReturnType<typeof filterColors>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });
};

export const AsyncSelectExample = () => {
  return (
    <div>
      <div>AsyncSelect</div>
      <AsyncSelect loadOptions={loadOptions} getOptionLabel={(option) => option.title} />
    </div>
  );
};
