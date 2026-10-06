import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";

export function useFetch(path, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(path));

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    apiRequest(path, { ...options, signal: controller.signal })
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [path]);

  return { data, error, loading };
}
