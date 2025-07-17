// frontend/pages/login.tsx
import React, { useState } from 'react';
import styles from '../styles/Login.module.css'; // Importa o módulo CSS para o login
import { useRouter } from 'next/router'; // Importa useRouter para redirecionamento

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
    // Lógica de autenticação aqui
    // Ex: Chamar uma API de login
    // Se sucesso, redirecionar para o dashboard
    // Por enquanto, apenas redireciona para o dashboard
    router.push('/dashboard');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          <img src="https://placehold.co/80x80/6366F1/ffffff?text=A" alt="Logo Aura" />
          <span className={styles.loginLogoText}>Aura ATS</span>
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>Usuário:</label>
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
            <label htmlFor="password" className={styles.formLabel}>Senha:</label>
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
          <button type="submit" className={styles.loginButton}>Entrar</button>
        </form>
        <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>
      </div>
    </div>
  );
};

export default LoginPage;
