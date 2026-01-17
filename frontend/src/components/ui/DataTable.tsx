import styles from "./ui.module.css";

export type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => string | number | JSX.Element;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
};

export function DataTable<T>({ columns, rows, rowKey }: Props<T>) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={rowKey(row, idx)}>
              {columns.map((c) => (
                <td key={String(c.key)}>
                  {c.render ? c.render(row) : (row[c.key] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
