import React, { useState, useRef, useMemo, ComponentProps, useEffect } from "react";
import tw from "twin.macro";
import { RamenroadText } from "../common/RamenroadText";
import { IconBack, IconClose, IconComment, IconDeleteSearchValue, IconLocate, IconSearch } from "../Icon";
import { useDebounce } from "../../hooks/common/useDebounce";
import { useSearchHistoryQuery } from "../../hooks/queries/useSearchQuery";
import { useRemoveSearchHistoryMutation } from "../../hooks/mutation/useSearchHistoryMutation";
import { useRamenyaSearchAutoCompleteQuery } from "../../hooks/queries/useRamenyaListQuery";
import { useSignInStore } from "../../states/sign-in";
import { useLocalStorage } from "usehooks-ts";
import { getTextMatch } from "../../util";
import NoResultBox from "../no-data/NoResultBox";
import { useSearchParams } from "react-router-dom";

interface SearchOverlayProps extends ComponentProps<"input"> {
  isSearching?: boolean;
  onSelectKeyword?: (keyword: string, isNearBy?: boolean) => void;
  keyword: string;
  setKeyword: (value: string) => void;
  isExternal?: boolean;
  isSearchOverlayOpen?: boolean;
  setIsSearchOverlayOpen?: (value: boolean) => void;
}

export const SearchOverlay = ({
  onSelectKeyword,
  keyword,
  setKeyword,
  isExternal = false,
  isSearchOverlayOpen = false,
  setIsSearchOverlayOpen,
  ...rest
}: SearchOverlayProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const [, setSearchParams] = useSearchParams();

  const { value: debouncedSearchValue } = useDebounce<string>(keyword, 300);

  const { searchHistoryQuery } = useSearchHistoryQuery();
  const { remove: removeSearchHistory } = useRemoveSearchHistoryMutation();
  const { ramenyaSearchAutoCompleteQuery } = useRamenyaSearchAutoCompleteQuery({ query: debouncedSearchValue });

  const { isSignIn } = useSignInStore((state) => state);

  // localStorage 기반 히스토리 (비회원용)
  const [signOutKeywordHistory, setSignOutKeywordHistory] = useLocalStorage<string[]>("signOutKeywordHistory", []);
  const [signOutRamenyaHistory, setSignOutRamenyaHistory] = useLocalStorage<{ _id: string; name: string }[]>(
    "signOutRamenyaHistory",
    [],
  );

  // 히스토리 getter
  const getKeywordHistory = () => {
    if (isSignIn) {
      return searchHistoryQuery.data?.searchKeywords || [];
    } else {
      return signOutKeywordHistory.map((keyword, idx) => ({ _id: String(idx), keyword }));
    }
  };
  const getRamenyaHistory = () => {
    if (isSignIn) {
      return searchHistoryQuery.data?.ramenyaNames || [];
    } else {
      return signOutRamenyaHistory.map((r) => ({ _id: r._id, keyword: r.name }));
    }
  };

  // 히스토리 추가/삭제
  const addKeywordHistory = (keyword: string) => {
    if (!isSignIn) {
      setSignOutKeywordHistory((prev) => [keyword, ...prev.filter((k) => k !== keyword)]);
      return;
    }
  };
  const removeKeywordHistory = (keyword: string) => {
    if (!isSignIn) {
      setSignOutKeywordHistory((prev) => prev.filter((k) => k !== keyword));
      return;
    }
  };
  const clearKeywordHistory = () => {
    if (!isSignIn) {
      setSignOutKeywordHistory([]);
      return;
    }
  };
  const addRamenyaHistory = (ramenya: { _id: string; name: string }) => {
    if (!isSignIn) {
      setSignOutRamenyaHistory((prev) => [ramenya, ...prev.filter((r) => r._id !== ramenya._id)]);
      return;
    }
  };
  const removeRamenyaHistory = (ramenya: { _id: string }) => {
    if (!isSignIn) {
      setSignOutRamenyaHistory((prev) => prev.filter((r) => r._id !== ramenya._id));
      return;
    }
  };
  const clearRamenyaHistory = () => {
    if (!isSignIn) {
      setSignOutRamenyaHistory([]);
      return;
    }
  };

  const isTyping = useMemo(() => keyword.length > 0, [keyword]);
  const isAutoCompleteResultExist = useMemo(() => {
    return (
      ramenyaSearchAutoCompleteQuery.data?.ramenyaSearchResults?.length !== 0 ||
      ramenyaSearchAutoCompleteQuery.data?.keywordSearchResults?.length !== 0
    );
  }, [ramenyaSearchAutoCompleteQuery.data]);

  const keywordHistory = getKeywordHistory();
  const ramenyaHistory = getRamenyaHistory();
  const isKeywordHistoryExist = keywordHistory.length > 0;
  const isRamenyaHistoryExist = ramenyaHistory.length > 0;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    setIsSearchOverlayOpen?.(false);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      onSelectKeyword?.(keyword, true);
      addKeywordHistory(keyword);
      handleBlur();
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    if (isExternal && isSearchOverlayOpen) {
      inputRef.current?.focus();
    }
  }, [isExternal, isSearchOverlayOpen]);

  return (
    <>
      {isExternal && !isSearchOverlayOpen ? (
        <></>
      ) : (
        <SearchOverlayContainer>
          {(isFocused || isExternal) && <FocusResetIcon onClick={handleBlur} />}
          <SearchBox>
            {!isFocused && (
              <IconWrapper>
                <IconSearch />
              </IconWrapper>
            )}
            <SearchInput
              ref={inputRef}
              {...rest}
              type="search"
              value={keyword}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder="장르 또는 매장으로 검색해 보세요"
            />
            <SearchDeleteIconWrapper
              onClick={() => {
                setSearchParams((prev) => {
                  prev.delete("selectedId");
                  prev.delete("keyword");
                  return prev;
                });
                setKeyword("");
              }}
            >
              {keyword && keyword.trim() !== "" && <IconDeleteSearchValue />}
            </SearchDeleteIconWrapper>
          </SearchBox>
        </SearchOverlayContainer>
      )}

      {(isFocused || (isExternal && isSearchOverlayOpen)) && (
        <FullScreenSearchOverlay>
          {isTyping ? (
            isAutoCompleteResultExist ? (
              <AutoCompleteContainer>
                {ramenyaSearchAutoCompleteQuery.data?.keywordSearchResults?.map((keywordResult) => (
                  <KeywardWrapper
                    key={keywordResult._id}
                    onClick={() => {
                      onSelectKeyword?.(keywordResult.name);
                      addKeywordHistory(keywordResult.name);
                      setIsFocused(false);
                      setIsSearchOverlayOpen?.(false);
                    }}
                  >
                    <IconLocate />
                    <span>
                      <MatchedText size={16} weight="sb">
                        {getTextMatch({ query: keywordResult.name, target: keywordResult.name }).matchedText}
                      </MatchedText>
                      <UnMatchedText size={16} weight="sb">
                        {getTextMatch({ query: keywordResult.name, target: keywordResult.name }).unMatchedText}
                      </UnMatchedText>
                    </span>
                  </KeywardWrapper>
                ))}
                {ramenyaSearchAutoCompleteQuery.data?.ramenyaSearchResults?.map((ramenyaResult) => (
                  <KeywardWrapper
                    key={ramenyaResult._id}
                    onClick={() => {
                      onSelectKeyword?.(ramenyaResult.name);
                      setKeyword(ramenyaResult.name);
                      addRamenyaHistory({ _id: ramenyaResult._id, name: ramenyaResult.name });
                      setIsFocused(false);
                      setIsSearchOverlayOpen?.(false);
                    }}
                  >
                    <IconLocate color={"#A0A0A0"} />
                    <span>
                      <MatchedText size={16} weight="sb">
                        {getTextMatch({ query: ramenyaResult.name, target: ramenyaResult.name }).matchedText}
                      </MatchedText>
                      <UnMatchedText size={16} weight="sb">
                        {getTextMatch({ query: ramenyaResult.name, target: ramenyaResult.name }).unMatchedText}
                      </UnMatchedText>
                    </span>
                  </KeywardWrapper>
                ))}
              </AutoCompleteContainer>
            ) : (
              <NoResultBox actionButton={<SubmitButton>제보하기</SubmitButton>} />
            )
          ) : (
            <>
              <HistoryContainer>
                <HistoryHeader>
                  <RamenroadText size={16} weight="sb">
                    최근 검색어
                  </RamenroadText>
                  <RemoveText
                    size={12}
                    weight="r"
                    onClick={() => {
                      if (isSignIn) {
                        if (searchHistoryQuery.data?.searchKeywords?.length === 0) return;
                        removeSearchHistory.mutate(
                          searchHistoryQuery.data?.searchKeywords?.map((keyword) => keyword._id) || [],
                        );
                      } else {
                        if (signOutKeywordHistory.length === 0) return;
                        clearKeywordHistory();
                      }
                    }}
                  >
                    전체 삭제
                  </RemoveText>
                </HistoryHeader>
                {isKeywordHistoryExist ? (
                  <HistoryTagWrapper>
                    {keywordHistory.map((keyword) => (
                      <KeywordHistoryTag
                        key={keyword._id}
                        onClick={() => {
                          onSelectKeyword?.(keyword.keyword);
                          addKeywordHistory(keyword.keyword);
                          setKeyword(keyword.keyword);
                          setIsFocused(false);
                          setIsSearchOverlayOpen?.(false);
                        }}
                      >
                        <RamenroadText size={14} weight="r">
                          {keyword.keyword}
                        </RamenroadText>
                        <XIcon
                          color="#A0A0A0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSignIn) {
                              removeSearchHistory.mutate([keyword._id]);
                            } else {
                              removeKeywordHistory(keyword.keyword);
                            }
                          }}
                        />
                      </KeywordHistoryTag>
                    ))}
                  </HistoryTagWrapper>
                ) : (
                  <NoHistoryWrapper>
                    <IconComment />
                    <NoHistoryText size={16} weight="r">
                      최근 검색어가 없어요
                    </NoHistoryText>
                  </NoHistoryWrapper>
                )}
              </HistoryContainer>
              <HistoryContainer>
                <HistoryHeader>
                  <RamenroadText size={16} weight="sb">
                    검색한 매장
                  </RamenroadText>
                  <RemoveText
                    size={12}
                    weight="r"
                    onClick={() => {
                      if (isSignIn) {
                        if (searchHistoryQuery.data?.ramenyaNames?.length === 0) return;
                        removeSearchHistory.mutate(
                          searchHistoryQuery.data?.ramenyaNames?.map((ramenya) => ramenya._id) || [],
                        );
                      } else {
                        if (signOutRamenyaHistory.length === 0) return;
                        clearRamenyaHistory();
                      }
                    }}
                  >
                    전체 삭제
                  </RemoveText>
                </HistoryHeader>
                <RamenyaHistoryWrapper>
                  {isRamenyaHistoryExist ? (
                    ramenyaHistory.map((ramenya) => (
                      <KeywardWrapper
                        key={ramenya._id}
                        onClick={() => {
                          onSelectKeyword?.(ramenya.keyword);
                          setKeyword(ramenya.keyword);
                          addRamenyaHistory({ _id: ramenya._id, name: ramenya.keyword });
                          setIsFocused(false);
                          setIsSearchOverlayOpen?.(false);
                        }}
                      >
                        <IconLocate color={"#A0A0A0"} />
                        <RamenroadText size={16} weight="r">
                          {ramenya.keyword}
                        </RamenroadText>
                        <RamenyaXIcon
                          color="#A0A0A0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSignIn) {
                              removeSearchHistory.mutate([ramenya._id]);
                            } else {
                              removeRamenyaHistory({ _id: ramenya._id });
                            }
                          }}
                        />
                      </KeywardWrapper>
                    ))
                  ) : (
                    <NoHistoryWrapper>
                      <IconComment />
                      <NoHistoryText size={16} weight="r">
                        검색한 매장이 없어요
                      </NoHistoryText>
                    </NoHistoryWrapper>
                  )}
                </RamenyaHistoryWrapper>
              </HistoryContainer>
            </>
          )}
        </FullScreenSearchOverlay>
      )}
    </>
  );
};

const AutoCompleteContainer = tw.div`
  flex flex-col
`;

const SubmitButton = tw.button`
  text-orange bg-[#FFE4CE]
  font-16-m
  px-32 py-10
  rounded-100
  outline-none border-none
  cursor-pointer
`;

const KeywardWrapper = tw.div`
  flex items-center gap-8
  h-36
  cursor-pointer
`;

const MatchedText = tw(RamenroadText)`
  text-orange
`;

const UnMatchedText = tw(RamenroadText)`
`;

const SearchOverlayContainer = tw.figure`
  absolute top-16 left-0 right-0 z-[200]
  m-0 px-20
  h-48
  box-border
  flex gap-12 items-center
`;

const SearchBox = tw.div`
  flex items-center gap-8
  w-full h-full rounded-8
  box-border border border-solid border-divider
  bg-white px-16 py-12
`;

const IconWrapper = tw.div`
  w-24 h-24
`;

const FocusResetIcon = tw(IconBack)`
  cursor-pointer
`;

const SearchInput = tw.input`
  w-full h-24
  bg-white border-none
  font-16-r text-black leading-24
  focus:outline-none align-middle
`;

const FullScreenSearchOverlay = tw.main`
  absolute w-full h-full inset-0 bg-white z-[150]
  flex flex-col gap-32
  box-border px-16 py-20 pt-84
`;

const HistoryContainer = tw.div`
  flex flex-col gap-16
`;

const HistoryHeader = tw.div`
  flex justify-between items-center
  w-full
`;

const RemoveText = tw(RamenroadText)`
  text-gray-400 cursor-pointer
`;

const HistoryTagWrapper = tw.div`
  flex flex-wrap gap-8
`;

const KeywordHistoryTag = tw.div`
  flex items-center gap-8
  box-border h-33
  py-6 px-12
  cursor-pointer
  border border-solid border-gray-200 rounded-50
  font-14-r text-gray-900
`;

const RamenyaHistoryWrapper = tw.div`
  flex flex-col
`;

const NoHistoryWrapper = tw.div`
  flex flex-col
  items-center gap-8
  cursor-pointer
  mt-12
`;

const NoHistoryText = tw(RamenroadText)`
  text-gray-400
`;

const RamenyaXIcon = tw(IconClose)`
  ml-auto
  w-9 h-9
  cursor-pointer
`;

const XIcon = tw(IconClose)`
  w-9 h-9
  cursor-pointer
`;

const SearchDeleteIconWrapper = tw.div`
  cursor-pointer
  flex h-full items-center
`;
