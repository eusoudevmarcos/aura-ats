// frontend/pages/_app.tsx
import "@/styles/Login.module.css";
import Link from "next/link";

function Home() {
  return (
    <section>
      <h1>Front-end da ATS</h1>
      <Link href="/login">Login</Link>
    </section>
  );
}

export default Home;
