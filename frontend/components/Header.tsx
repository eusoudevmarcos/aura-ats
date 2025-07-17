import styles from './Header.module.css';

type Props = { toggleSidebar: () => void };

export default function Header({ toggleSidebar }: Props) {
  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        ☰
      </button>
      <div className={styles.spacer}></div>
      <h1 className={styles.title}>Dashboard Admin</h1>
      <div className={styles.actions}>
        {/* aqui podem vir ícones de perfil, notificações etc */}
        <button className={styles.icon}>🔔</button>
        <button className={styles.icon}>👤</button>
      </div>
    </header>
  );
}
