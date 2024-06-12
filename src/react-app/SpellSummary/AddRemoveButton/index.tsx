import styles from './index.module.css';
import { IconAdd } from '../../icons/IconAdd';
import { IconCheckmark } from '../../icons/IconCheckmark';

interface AddRemoveButtonProps {
  isChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
  title: string;
}

export const AddRemoveButton = ({ isChecked, onChange, title }: AddRemoveButtonProps) => (
  <button
    aria-label={
      isChecked ? `Remove "${title}" from known spells` : `Add "${title}" to known spells`
    }
    className={`${styles.addButton} ${isChecked ? styles.checked : ''} secondary`}
    onClick={() => onChange(isChecked)}
  >
    <IconCheckmark />
    <IconAdd />
  </button>
);
