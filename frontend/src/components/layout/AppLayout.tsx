import React from "react";
import { TopBar } from "./TopBar";
import { SideNav, type NavItem } from "./SideNav";
import styles from "./layout.module.css";

type Props = {
  brand: string;
  navItems: NavItem[];
  children: React.ReactNode;
};

export function AppLayout({ brand, navItems, children }: Props) {
  return (
    <div className={styles.app}>
      <TopBar brand={brand} />
      <div className={styles.body}>
        <SideNav items={navItems} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
