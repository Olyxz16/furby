"use client";

import styles from "./layout.module.css";

type Props = { brand?: string };

export function TopBarClient({ brand = "PROJET" }: Props) {
  // For now show a static username to match the screenshot.

  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>{brand}</div>
      <div className={styles.topbarRight}>
        <div className={styles.badge}>Connexion</div>
      </div>
    </header>
  );
}
