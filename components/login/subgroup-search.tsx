"use client";

import SearchBar from "../ui/search-bar";
import { useState, useEffect } from "react";
import { APICaller } from "@/utils/apiCaller";

export function SubgroupSearch() {
  const [allSuggestions, setAllSuggestions] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await APICaller({ method: "GET", path: "/subgroup/" });
      const sg = data.map((item: any) => {
        return item.lab_tut_group;
      });
      setAllSuggestions(sg);
    })();
  }, []);

  return (
    <>
      <SearchBar
        allSuggestions={allSuggestions}
        placeholder="Search your timetable ..."
        path="student"
        param="subgroup"
      />
    </>
  );
}
