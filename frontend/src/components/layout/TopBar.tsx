import styles from "./layout.module.css";

type Props = { brand: string };

export function TopBar({ brand }: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>{brand}</div>
      <div className={styles.topbarRight}>
        <div className={styles.badge}>v2</div>
      </div>
    </header>
  );
}
