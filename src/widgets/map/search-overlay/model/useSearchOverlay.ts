import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { useRamenyaSearchAutoCompleteQuery } from "@/entities/ramenya/model";
import { useSignInStore } from "@/entities/viewer/model";
import { useRemoveSearchHistoryMutation, useSearchHistoryQuery } from "@/features/search/model";
import { useDebounce } from "@/shared/lib/use-debounce";
import { updateSearchParams } from "@/shared/lib/search-params";

interface SearchOverlayModelProps {
  keyword: string;
  setKeyword: (value: string) => void;
  isExternal: boolean;
  isSearchOverlayOpen: boolean;
  setIsSearchOverlayOpen?: (value: boolean) => void;
  onSelectKeyword?: (keyword: string, isNearBy?: boolean) => void;
}

type KeywordHistoryItem = { _id: string; keyword: string };
type RamenyaHistoryItem = { _id: string; keyword: string };

export const useSearchOverlay = ({
  keyword,
  setKeyword,
  isExternal,
  isSearchOverlayOpen,
  setIsSearchOverlayOpen,
  onSelectKeyword,
}: SearchOverlayModelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const { value: debouncedSearchValue } = useDebounce<string>(keyword, 300);
  const { isSignIn } = useSignInStore((state) => state);

  const { searchHistoryQuery } = useSearchHistoryQuery();
  const { remove: removeSearchHistory } = useRemoveSearchHistoryMutation();
  const { ramenyaSearchAutoCompleteQuery } = useRamenyaSearchAutoCompleteQuery({ query: debouncedSearchValue });

  const [signOutKeywordHistory, setSignOutKeywordHistory] = useLocalStorage<string[]>("signOutKeywordHistory", []);
  const [signOutRamenyaHistory, setSignOutRamenyaHistory] = useLocalStorage<{ _id: string; name: string }[]>(
    "signOutRamenyaHistory",
    [],
  );

  const keywordHistory = useMemo<KeywordHistoryItem[]>(() => {
    if (isSignIn) {
      return searchHistoryQuery.data?.searchKeywords ?? [];
    }

    return signOutKeywordHistory.map((historyKeyword, index) => ({ _id: String(index), keyword: historyKeyword }));
  }, [isSignIn, searchHistoryQuery.data?.searchKeywords, signOutKeywordHistory]);

  const ramenyaHistory = useMemo<RamenyaHistoryItem[]>(() => {
    if (isSignIn) {
      return (searchHistoryQuery.data?.ramenyaNames ?? []).map((ramenya) => ({
        _id: ramenya._id,
        keyword: ramenya.keyword,
      }));
    }

    return signOutRamenyaHistory.map((ramenya) => ({ _id: ramenya._id, keyword: ramenya.name }));
  }, [isSignIn, searchHistoryQuery.data?.ramenyaNames, signOutRamenyaHistory]);

  const keywordResults = ramenyaSearchAutoCompleteQuery.data?.keywordSearchResults ?? [];
  const ramenyaResults = ramenyaSearchAutoCompleteQuery.data?.ramenyaSearchResults ?? [];
  const isTyping = keyword.length > 0;
  const hasAutoCompleteResults = keywordResults.length > 0 || ramenyaResults.length > 0;
  const isOverlayVisible = isFocused || (isExternal && isSearchOverlayOpen);
  const shouldRenderSearchBox = !isExternal || isSearchOverlayOpen;

  useEffect(() => {
    if (isExternal && isSearchOverlayOpen) {
      inputRef.current?.focus();
    }
  }, [isExternal, isSearchOverlayOpen]);

  const closeOverlay = () => {
    setIsFocused(false);
    setIsSearchOverlayOpen?.(false);
  };

  const addKeywordHistory = (nextKeyword: string) => {
    if (!isSignIn) {
      setSignOutKeywordHistory((prev) => [nextKeyword, ...prev.filter((historyKeyword) => historyKeyword !== nextKeyword)]);
    }
  };

  const addRamenyaHistory = (ramenya: { _id: string; name: string }) => {
    if (!isSignIn) {
      setSignOutRamenyaHistory((prev) => [ramenya, ...prev.filter((history) => history._id !== ramenya._id)]);
    }
  };

  const removeKeywordHistory = (keywordToRemove: string) => {
    if (isSignIn) {
      const target = keywordHistory.find((item) => item.keyword === keywordToRemove);

      if (target) {
        removeSearchHistory.mutate([target._id]);
      }
      return;
    }

    setSignOutKeywordHistory((prev) => prev.filter((historyKeyword) => historyKeyword !== keywordToRemove));
  };

  const removeRamenyaHistory = (ramenyaId: string) => {
    if (isSignIn) {
      removeSearchHistory.mutate([ramenyaId]);
      return;
    }

    setSignOutRamenyaHistory((prev) => prev.filter((history) => history._id !== ramenyaId));
  };

  const clearKeywordHistory = () => {
    if (isSignIn) {
      const ids = keywordHistory.map((item) => item._id);

      if (ids.length > 0) {
        removeSearchHistory.mutate(ids);
      }
      return;
    }

    setSignOutKeywordHistory([]);
  };

  const clearRamenyaHistory = () => {
    if (isSignIn) {
      const ids = ramenyaHistory.map((item) => item._id);

      if (ids.length > 0) {
        removeSearchHistory.mutate(ids);
      }
      return;
    }

    setSignOutRamenyaHistory([]);
  };

  const selectKeyword = (nextKeyword: string, isNearBy?: boolean) => {
    onSelectKeyword?.(nextKeyword, isNearBy);
    setKeyword(nextKeyword);
    closeOverlay();
  };

  const handleInputFocus = () => setIsFocused(true);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.key !== "Enter") {
      return;
    }

    addKeywordHistory(keyword);
    selectKeyword(keyword, true);
    inputRef.current?.blur();
  };

  const handleClearKeyword = () => {
    setSearchParams((prev) =>
      updateSearchParams(prev, (nextParams) => {
        nextParams.delete("selectedId");
        nextParams.delete("keyword");
      }),
    );
    setKeyword("");
  };

  const handleKeywordResultClick = (nextKeyword: string) => {
    addKeywordHistory(nextKeyword);
    selectKeyword(nextKeyword);
  };

  const handleRamenyaResultClick = (ramenya: { _id: string; name: string }) => {
    addRamenyaHistory(ramenya);
    selectKeyword(ramenya.name);
  };

  const handleKeywordHistoryClick = (historyKeyword: string) => {
    addKeywordHistory(historyKeyword);
    selectKeyword(historyKeyword);
  };

  const handleRamenyaHistoryClick = (ramenya: { _id: string; keyword: string }) => {
    addRamenyaHistory({ _id: ramenya._id, name: ramenya.keyword });
    selectKeyword(ramenya.keyword);
  };

  return {
    inputRef,
    keyword,
    isFocused,
    isTyping,
    isOverlayVisible,
    shouldRenderSearchBox,
    hasAutoCompleteResults,
    keywordHistory,
    ramenyaHistory,
    keywordResults,
    ramenyaResults,
    handleInputFocus,
    handleInputChange,
    handleInputKeyDown,
    handleClearKeyword,
    handleCloseOverlay: closeOverlay,
    handleKeywordResultClick,
    handleRamenyaResultClick,
    handleKeywordHistoryClick,
    handleRamenyaHistoryClick,
    handleKeywordHistoryDelete: removeKeywordHistory,
    handleRamenyaHistoryDelete: removeRamenyaHistory,
    handleKeywordHistoryClear: clearKeywordHistory,
    handleRamenyaHistoryClear: clearRamenyaHistory,
  };
};
