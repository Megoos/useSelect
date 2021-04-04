import { colors } from 'data/colors';
import { AutoSelect } from 'ui/AutoSelect';

const filter = (option: typeof colors[number], inputValue: string) =>
  option.title.toLowerCase().includes(inputValue.toLowerCase());

export const AutoSelectExample = () => {
  return (
    <div>
      <div>AutoSelect</div>
      <AutoSelect options={colors} getOptionLabel={(option) => option.title} filterOptions={filter} />
    </div>
  );
};
