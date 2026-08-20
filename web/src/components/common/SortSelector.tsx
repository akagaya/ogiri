import styles from './SortSelector.module.scss';

interface SortSelectorProps<T extends string> {
  currentSort: T;
  onChange: (sort: T) => void;
  options?: { value: T; label: string }[];
}

export function SortSelector<T extends string>({ 
  currentSort, 
  onChange, 
  options = []
}: SortSelectorProps<T>) {
  return (
    <div className={styles.container}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`${styles.button} ${currentSort === option.value ? styles.active : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
