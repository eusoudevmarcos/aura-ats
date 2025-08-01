import { useEffect } from "react";

function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      window.location.href = "https://www.aurareslabs.com/";
    } else {
      window.location.href = "http://localhost:3001";
    }
  }, []);

  return null;
}

export default Home;
