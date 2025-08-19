import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/axios";

interface UserData {
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

const UserPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (uuid) {
      const fetchUser = async () => {
        setLoading(true);
        setErro(null);
        try {
          const resp = await api.get("/funcionario/" + uuid);

          if (resp.status === 200) {
            setUserData(resp.data);
          } else {
            setErro("Usuário não encontrado.");
          }
        } catch (error: any) {
          setErro("Erro ao buscar usuário: " + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [uuid]);

  if (loading) {
    return <div>Carregando dados do usuário...</div>;
  }

  if (erro) {
    return <div style={{ color: "red" }}>{erro}</div>;
  }

  if (!userData) {
    return <div>Nenhum dado encontrado para este usuário.</div>;
  }

  return (
    <div className="bg-white shadow-md p-6">
      <h1 className="text-[#8c53ff] font-bold mb-4">Perfil do Usuário</h1>
      <ul className="[&>li]:mb-1 list-none p-0">
        {Object.entries(userData).map(([key, value]) => {
          if (value === null || value === undefined || value === "")
            return null;

          // Função recursiva para iterar sobre objetos aninhados
          const renderObject = (obj: any) => (
            <ul style={{ listStyle: "none", paddingLeft: 16 }}>
              {Object.entries(obj).map(([k, v]) => {
                if (v === null || v === undefined || v === "") return null;
                if (typeof v === "object" && v !== null) {
                  return (
                    <li key={k} style={{ marginBottom: 8 }}>
                      <strong>{k}:</strong>
                      {renderObject(v)}
                    </li>
                  );
                }
                return (
                  <li key={k}>
                    <strong>{k}:</strong> {String(v)}
                  </li>
                );
              })}
            </ul>
          );

          if (typeof value === "object" && value !== null) {
            return (
              <li key={key}>
                <strong>{key}:</strong>
                {renderObject(value)}
              </li>
            );
          } else {
            return (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default UserPage;
