"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar({
  allSuggestions,
  placeholder,
  path,
  param,
}: {
  allSuggestions: string[];
  placeholder: string;
  path: string;
  param: string;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  useEffect(() => {
    const filteredSuggestions = allSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(query.toLowerCase()),
    );
    setSuggestions(filteredSuggestions);
    setIsOpen(filteredSuggestions.length > 0 && query.length > 0);
  }, [query, allSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpen(false);
    router.push(`/${path}?${param}=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pr-10"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={isOpen}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
          aria-label="Submit search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {isOpen && (
        <ul
          ref={suggestionsRef}
          id="suggestions-list"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-zinc-900"
              role="option"
              aria-selected={query === suggestion}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
