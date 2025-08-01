// frontend/pages/login.tsx
import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetServerSideProps } from "next";
import nookies from "nookies";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);

  if (cookies.token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // sem redirecionamento, renderiza normalmente
  };
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Login falhou");
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
              type="text"
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
          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>
        <a href="#" className={styles.forgotPassword}>
          Esqueceu a senha?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
