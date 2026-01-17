"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

const items = [
  { label: "Home", to: "/" },
];

export function SideNavClient() {
  const pathname = usePathname() || "/";

  return (
    <aside className={styles.sidenav}>
      <nav className={styles.nav}>
        {items.map((it) => (
          <Link
            key={it.to}
            href={it.to}
            className={pathname === it.to ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
