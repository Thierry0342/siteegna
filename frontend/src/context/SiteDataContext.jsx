import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchSite } from "../services/api";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetchSite()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteDataContext.Provider value={{ data, loading, error, refresh }}>
      {children}
    </SiteDataContext.Provider>
  );
}

// Hook à utiliser dans les pages à la place de loadData()
export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData doit être utilisé à l'intérieur de <SiteDataProvider>");
  return ctx;
}
