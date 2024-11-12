import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      // Use hardcoded token or an unauthenticated access
      const supabaseAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraWZibW5odnNwZWhoaHlqbHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNDg5ODgsImV4cCI6MjA0NjcyNDk4OH0.imPzAFTTRUfQa4k1sJr-nD3ISvTq3lv2ySGvzJ0DQCw"; // Bypass Clerk and use your token

      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
