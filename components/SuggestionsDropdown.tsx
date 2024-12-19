"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSuggestions } from "../hooks/useSuggestions";
import { SuggestionModal } from "./SuggestionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SuggestionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const { suggestions, isLoading, error } = useSuggestions();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const openModal = (suggestion: { title: string; content: string }) => {
    setSelectedSuggestion(suggestion);
  };

  const closeModal = () => {
    setSelectedSuggestion(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={toggleDropdown}
        variant="outline"
        size="lg"
        className="w-full mr-20"
      >
        Conflicts
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </Button>
      {isOpen && (
        <Card className="absolute z-10 mt-2 w-64 max-h-96 overflow-auto shadow-lg">
          <CardContent className="p-2">
            {isLoading && <p className="text-sm p-2">Loading suggestions...</p>}
            {error && <p className="text-sm text-red-500 p-2">{error}</p>}
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                variant="ghost"
                className="w-full justify-start text-left mb-2 whitespace-normal h-auto text-sm"
                onClick={() => openModal(suggestion)}
              >
                <div className="w-full">
                  <h3 className="font-semibold break-words">
                    {suggestion.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 break-words">
                    {suggestion.content}
                  </p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
      <SuggestionModal
        isOpen={!!selectedSuggestion}
        onClose={closeModal}
        suggestion={selectedSuggestion}
      />
    </div>
  );
}
