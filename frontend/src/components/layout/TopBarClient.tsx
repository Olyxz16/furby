"use client";

import styles from "./layout.module.css";

type Props = { brand?: string };

export function TopBarClient({ brand = "PROJET" }: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>{brand}</div>
      <div className={styles.topbarRight}>
        <div className={styles.badge}>Connexion</div>
      </div>
    </header>
  );
}
