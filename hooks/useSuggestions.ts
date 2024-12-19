"use client";

import { useState, useEffect } from "react";

interface Suggestion {
  id: string;
  title: string;
  content: string;
}

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const response = await fetch("/api/suggestions");
        if (!response.ok) {
          throw new Error("No conflicts");
        }
        const data = await response.json();
        setSuggestions(data);
        setIsLoading(false);
      } catch (err) {
        setError("No conflicts");
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, []);

  return { suggestions, isLoading, error };
}
