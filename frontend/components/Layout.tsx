import { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './Content.module.css';

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className={styles.container}>
      <Sidebar open={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={styles.main}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <section className={styles.content}>{children}</section>
      </div>
    </div>
  );
}
