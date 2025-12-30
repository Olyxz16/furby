import { NavLink } from "react-router-dom";
import styles from "./layout.module.css";

export type NavItem = { label: string; to: string };

type Props = { items: NavItem[] };

export function SideNav({ items }: Props) {
  return (
    <aside className={styles.sidenav}>
      <nav className={styles.nav}>
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            {it.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
