import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/getUser")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  return user;
}
