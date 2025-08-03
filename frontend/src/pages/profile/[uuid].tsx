import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import api from "@/axios";
import DashboardLayout from "@/layout/DashboardLayout";

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
          console.log(uuid);
          const resp = await api.get("/api/users/" + uuid);
          console.log(resp);
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
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <h1>Perfil do Usuário</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(userData).map(([key, value]) => (
          <li key={key} style={{ marginBottom: 12 }}>
            <strong>{key}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;
