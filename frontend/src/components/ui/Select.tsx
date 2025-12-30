import styles from "./ui.module.css";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
};

export function Select<T extends string>({ options, value, onChange, placeholder }: Props<T>) {
  return (
    <select
      className={styles.select}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value as T)}
    >
      <option value="" disabled>
        {placeholder ?? "Select…"}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
