import { useEffect } from "react";

function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      window.location.href = "https://aura-ats-frontend.vercel.app/login";
    } else {
      window.location.href = "http://localhost:3000/login";
    }
  }, []);

  return null;
}

export default Home;
