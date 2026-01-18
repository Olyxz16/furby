"use client";

import styles from "./layout.module.css";

type Props = { brand?: string };

export function TopBarClient({ brand = "PROJET" }: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>{brand}</div>

      <div className={styles.topbarRight}>
        <a
          href="/login"
          className={styles.badge}
          style={{ cursor: "pointer", textDecoration: "none" }}
        >
          Connexion
        </a>
      </div>
    </header>
  );
}
