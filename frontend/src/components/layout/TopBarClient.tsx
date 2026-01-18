"use client";

import styles from "./layout.module.css";

type Props = { brand?: string };

export function TopBarClient({ brand = "AGENDA" }: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>{brand}</div>
    </header>
  );
}
