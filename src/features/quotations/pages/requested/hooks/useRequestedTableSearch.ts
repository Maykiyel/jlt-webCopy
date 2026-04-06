import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

interface UseRequestedTableSearchOptions {
  debounceMs?: number;
  initialPerPage?: number;
}

export function useRequestedTableSearch(
  options: UseRequestedTableSearchOptions = {},
) {
  const { debounceMs = 400, initialPerPage = 10 } = options;

  const [search, setSearch] = useState("");
  const [immediateQuery, setImmediateQuery] = useState<string | null>(null);
  const [debouncedSearch] = useDebouncedValue(search, debounceMs);
  const [perPage, setPerPage] = useState(initialPerPage);
  const searchQuery = immediateQuery ?? debouncedSearch.trim();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setImmediateQuery(null);
    if (!value.trim()) {
      setImmediateQuery("");
    }
  };

  const handleSearch = (value: string) => {
    const nextValue = value.trim();
    setSearch(nextValue);
    setImmediateQuery(nextValue);
  };

  return {
    search,
    searchQuery,
    perPage,
    setPerPage,
    handleSearch,
    handleSearchChange,
  };
}
