import Link from 'next/link';
import styles from './Sidebar.module.css';

type Props = { open: boolean; toggle: () => void };

export default function Sidebar({ open, toggle }: Props) {
  const menu = [
    { href: '/dashboard', icon: '🏠', label: 'Geral' },
    { href: '/usuarios', icon: '👥', label: 'Usuários' },
    { href: '/vagas', icon: '📂', label: 'Vagas' },
    { href: '/candidatos', icon: '📝', label: 'Candidatos' },
    { href: '/relatorios', icon: '📊', label: 'Relatórios' },
  ];

  return (
    <nav className={`${styles.sidebar} ${open ? '' : styles.closed}`}>
      <ul className={styles.navList}>
        {menu.map(item => (
          <li key={item.href} className={styles.navItem}>
            <Link href={item.href} className={styles.navLink}>
              <span>{item.icon}</span>
              {open && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <button className={styles.toggle} onClick={toggle}>
        {open ? '◀' : '▶'}
      </button>
    </nav>
  );
}
