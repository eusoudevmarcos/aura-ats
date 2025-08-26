import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "@/components/card";

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
    <Card title={activeSubMenu}>
      <nav className="flex gap-4 mb-6 border-b border-gray-200">
        {["Agendas", "Tarefas", "Vagas", "Entrevistas"].map((item) => (
          <button
            key={item}
            className={`py-3 text-base font-medium border-b-2 transition-all duration-200 ${
              activeSubMenu === item
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
            onClick={() => handleSubMenuClick(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      {children}
    </Card>
  );
}
