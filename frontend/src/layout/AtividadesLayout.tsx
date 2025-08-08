import styles from "@/components/Card/Cards.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AtividadeLayout({ children }: any) {
  const router = useRouter();
  const [activeSubMenu, setActiveSubMenu] = useState("");

  useEffect(() => {
    if (router && router.asPath) {
      const pathParts = router.asPath.split("/").filter(Boolean);
      if (pathParts.length > 1) {
        setActiveSubMenu(
          pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1)
        );
      } else {
        setActiveSubMenu("");
      }
    }
  }, [router.asPath]);

  const handleSubMenuClick = (item: string) => {
    const lower = item.toLowerCase();
    router.push(`/atividades/${lower}`);
    setActiveSubMenu(item);
  };

  return (
    <div className={styles.activitySection}>
      <h2 className={styles.activityHeader}>{activeSubMenu}</h2>
      <nav className={styles.activityNav}>
        {["Agendas", "Tarefas", "Vagas", "Entrevistas"].map((item) => (
          <button
            key={item}
            className={`${styles.activityNavItem} ${
              activeSubMenu === item ? styles.activityNavItemActive : ""
            }`}
            onClick={() => handleSubMenuClick(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className={styles.activityContent}>{children}</div>
    </div>
  );
}
