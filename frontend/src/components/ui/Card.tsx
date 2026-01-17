import React from "react";
import styles from "./ui.module.css";

type Props = {
  title?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
};

export function Card({ title, right, children }: Props) {
  return (
    <section className={styles.card}>
      {(title || right) && (
        <div className={styles.cardHeader}>
          {title && <h2 className={styles.cardTitle}>{title}</h2>}
          {right && <div>{right}</div>}
        </div>
      )}
      <div className={styles.cardBody}>{children}</div>
    </section>
  );
}
