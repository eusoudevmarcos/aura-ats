// pages/login.tsx
import styles from '../styles/Login.module.css';

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <img src="/auralogo.svg" alt="Logo" className={styles.logo} />
        <form className={styles.form}>
          <input type="email" placeholder="E-mail" className={styles.input} />
          <input type="password" placeholder="Senha" className={styles.input} />
          <button type="submit" className={styles.button}>Entrar</button>
        </form>
      </div>
    </div>
  );
}
