// frontend/pages/login.tsx
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import api from "@/axios";
import nookies from "nookies";
import jwt from "jsonwebtoken";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const token = cookies.token;

  if (cookies.token) {
    return {
      redirect: {
        destination: "/atividades/agendas",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Chamada para API externa
      const res = await api.post("/api/auth/login", {
        username,
        password,
      });

      if (res.status === 200) {
        // Envie o token para o Next.js setar o cookie
        await fetch("/api/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: res.data.token }),
        });

        localStorage.setItem("uid", res.data.uid);

        router.push("/atividades/agendas");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          <Image src="/Aura-icon.svg" width={30} height={30} alt="Logo Aura" />
          <span className={styles.loginLogoText}>Aura ATS</span>
        </div>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>
              Usuário:
            </label>
            <input
              type="email"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
        <Link href="#" className={styles.forgotPassword}>
          Esqueceu a senha?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
