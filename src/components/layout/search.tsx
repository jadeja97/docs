// oxlint-disable eslint/max-lines

"use client";

/* ============================================================================================= */

import debounce from "@jadeja/ts/lib/debounce";
import { useState, useEffect, startTransition, useRef, createContext, useContext } from "react";

import { XIcon } from "@/components/assets/icons";
import { Button } from "@/components/button";
import { DialogClose } from "@/components/dialog";
import { Link } from "@/components/link";
import { List } from "@/components/list";
import { AlienLife } from "@/components/loaders/alien-life";
import { ZZZZ } from "@/components/loaders/zzzz";
import { Separator } from "@/components/separator";
import { useSearch } from "@/hooks/use-search";
import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement, ReactNode } from "react";

import type { DialogCloseProps } from "@/components/dialog";
import type { SearchError, SearchQueryResult, UseSearchOptions } from "@/hooks/use-search";

/* ============================================================================================= */

// oxlint-disable-next-line react/only-export-components
export const SearchContext = createContext<SearchRootChildParams | null>(null);

// oxlint-disable-next-line react/only-export-components
export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("components must be used inside SearchRoot");
  }

  return context;
};

/* ============================================================================================= */

export interface SearchRootChildParams {
  search: string;
  ready: boolean;
  handleSearch: (text: string) => void;
  error: SearchError;
  result: SearchQueryResult | undefined;
}

export type SearchRootProps = {
  children: ReactNode;
} & UseSearchOptions &
  ComponentProps<"div">;

export const SearchRoot = ({
  children,
  className,
  DEV,
  SEARCH_INDEX_FIELDS,
  SEARCH_INDEX_FILE_NAME,
  SEARCH_INDEX_RETURN_FIELDS,
  ...rest
}: SearchRootProps): ReactElement<HTMLDivElement> => {
  //
  const { initialize, ready, error, query } = useSearch({
    DEV,
    SEARCH_INDEX_FIELDS,
    SEARCH_INDEX_FILE_NAME,
    SEARCH_INDEX_RETURN_FIELDS,
  });

  const [search, setSearch] = useState("");
  const [result, setResult] = useState<SearchQueryResult>();

  useEffect(() => {
    if (!ready) {
      // oxlint-disable-next-line typescript/no-floating-promises
      initialize();
    }
  }, [ready, initialize]);

  const handleSearch = (text: string) => {
    setSearch(text);
    setResult(undefined);

    startTransition(() => {
      //
      debounce(() => {
        const fn = async () => {
          const queryResult = await query(text);
          setResult(queryResult);
        };
        // oxlint-disable-next-line typescript/no-floating-promises
        fn();
      });
    });
  };

  return (
    // oxlint-disable-next-line react/jsx-no-constructed-context-values
    <SearchContext.Provider value={{ search, ready, handleSearch, error, result }}>
      <div className={cls("search", className)} {...rest}>
        {children}
      </div>
    </SearchContext.Provider>
  );
};

/* ============================================================================================= */

export type SearchProps = UseSearchOptions;

export const Search = (props: SearchProps): ReturnType<typeof SearchRoot> => {
  return (
    <SearchRoot {...props}>
      <SearchCloseButton>
        <XIcon />
      </SearchCloseButton>

      <SearchInput />

      <SearchErrorRoot>
        <SearchErrorMessage />
      </SearchErrorRoot>

      <SearchResult>
        <SearchResultStates />
        <Separator />
        <SearchResultContainer>
          <SearchResultNoContent />
          <SearchResultListRoot>
            <SearchResultList />
          </SearchResultListRoot>
        </SearchResultContainer>
      </SearchResult>

      <SearchLoaderRoot>
        <SearchLoader />
      </SearchLoaderRoot>
    </SearchRoot>
  );
};

/* ============================================================================================= */

export type SearchErrorRootProps = {
  children: ReactNode;
} & ComponentProps<"div">;

export const SearchErrorRoot = ({
  className,
  children,
  ...rest
}: SearchErrorRootProps): ReactElement<HTMLDivElement> | null => {
  const { error } = useSearchContext();

  if (!error) {
    return null;
  }

  return (
    <div className={cls("search-error", className)} {...rest}>
      {children}
    </div>
  );
};

/* ============================================================================================= */

export type SearchErrorMessageProps = ComponentProps<"p">;

export const SearchErrorMessage = ({
  className,
  ...rest
}: SearchErrorMessageProps): ReactElement<HTMLParagraphElement> => {
  const { error } = useSearchContext();
  return (
    <p className={cls("search-error__message", className)} {...rest}>
      {error?.message ?? "Something went wrong!"}
    </p>
  );
};

/* ============================================================================================= */

export type SearchInputProps = ComponentProps<"div"> & {
  input?: ComponentProps<"input">;
};

export const SearchInput = ({
  className,
  input,
  ...rest
}: SearchInputProps): ReactElement<HTMLDivElement> => {
  //
  const inputRef = useRef<HTMLInputElement>(null);

  const { ready, search, handleSearch } = useSearchContext();

  useEffect(() => {
    if (ready) {
      inputRef.current?.focus();
    }
  }, [ready]);

  return (
    <div className={cls("search__input", className)} {...rest}>
      <input
        type="text"
        name="search"
        ref={inputRef}
        placeholder="Search docs..."
        autoComplete="off"
        disabled={!ready}
        value={search}
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
        {...input}
      />
    </div>
  );
};

/* ============================================================================================= */

export type SearchResultProps = ComponentProps<"div">;

export const SearchResult = ({
  className,
  children,
  ...rest
}: SearchResultProps): ReactElement<HTMLDivElement> | null => {
  const { error, result } = useSearchContext();

  if (!(!error && result)) {
    return null;
  }

  return (
    <div className={cls("search-result", className)} {...rest}>
      {children}
    </div>
  );
};

/* ============================================================================================= */

export type SearchResultStatesProps = ComponentProps<"div">;

export const SearchResultStates = ({
  className,
  ...rest
}: SearchResultStatesProps): ReactElement<HTMLDivElement> => {
  const { result } = useSearchContext();
  return (
    <div className={cls("search-result__states", className)} {...rest}>
      <span>
        Found {result?.count ?? 0} results in {((result?.time ?? 0) / 10).toFixed(2)} seconds
      </span>{" "}
      <br />
      <span>Search isn&apos;t perfect. some results may be unrelated.</span>
    </div>
  );
};

/* ============================================================================================= */

export type SearchResultContainerProps = {
  children: ReactNode;
  scrollFade?: boolean;
} & ComponentProps<"div">;

export const SearchResultContainer = ({
  scrollFade = true,
  children,
  className,
}: SearchResultContainerProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("search-result__container", { "scroll-fade": scrollFade }, className)}>
      {children}
    </div>
  );
};

/* ============================================================================================= */

export type SearchResultNoContentProps = {
  children?: ReactNode;
} & ComponentProps<"p">;

export const SearchResultNoContent = ({
  children,
  className,
}: SearchResultNoContentProps): ReactElement<HTMLParagraphElement> | null => {
  //
  const { result } = useSearchContext();

  if ((result?.count ?? 0) > 0) {
    return null;
  }

  return (
    <p className={cls("search-result__no-content", className)}>
      {children ?? "Data not available."}
    </p>
  );
};

/* ============================================================================================= */

export type SearchResultListRootProps = {
  children: ReactNode;
} & ComponentProps<"ul">;

export const SearchResultListRoot = ({
  children,
  className,
  ...rest
}: SearchResultListRootProps): ReturnType<typeof List> | null => {
  //
  const { result } = useSearchContext();

  if ((result?.count ?? 0) === 0) {
    return null;
  }

  return (
    <List unstyled className={cls("search-result__list", className)} {...rest}>
      {children}
    </List>
  );
};

/* ============================================================================================= */

export type SearchResultListProps = ComponentProps<"li">;

export const SearchResultList = (props: SearchResultListProps): ReactElement | null => {
  //
  const { result } = useSearchContext();

  return (
    // oxlint-disable-next-line react/jsx-no-useless-fragment
    <>
      {result?.data?.map((data) => {
        return (
          // oxlint-disable-next-line typescript/no-unsafe-assignment
          <li key={data.id} {...props}>
            <DialogClose isWrapper hideFocus>
              {/* oxlint-disable typescript/no-unsafe-assignment */}
              <Link href={data.url} title={data.title}>
                <span className="link__label">{data.metaTitle ?? data.label}</span>
                <span className="link__url">{data.url}</span>
                <span className="link__confidence">Confidence: {data.score.toFixed(2)}%</span>
              </Link>
            </DialogClose>
          </li>
        );
      })}
    </>
  );
};

/* ============================================================================================= */

export type SearchCloseButtonProps = {
  children: ReactNode;
} & DialogCloseProps;

export const SearchCloseButton = ({
  children,
  ...rest
}: SearchCloseButtonProps): ReturnType<typeof DialogClose> => {
  return (
    <DialogClose hideCloseButton={false} render={<Button variant="ghost" />} {...rest}>
      {children}
      <span className="screen-reader">close search popup</span>
    </DialogClose>
  );
};

/* ============================================================================================= */

export type SearchLoaderRootProps = {
  children: ReactNode;
} & ComponentProps<"div">;

export const SearchLoaderRoot = ({
  children,
}: SearchLoaderRootProps): ReactElement<HTMLDivElement> | null => {
  //
  const { error, result } = useSearchContext();

  if (!error && result) {
    return null;
  }

  return <div className="search-loader__wrapper">{children}</div>;
};

/* ============================================================================================= */

export type SearchLoaderProps = ComponentProps<"div">;

export const SearchLoader = ({ ...rest }: SearchLoaderProps): ReactElement<HTMLDivElement> => {
  //

  const { search, ready } = useSearchContext();

  /* 1. no input */
  if (!search.trim() && ready) {
    return <ZZZZ {...rest} />;
  }

  /* 2. fetching search index or results */
  return <AlienLife {...rest} />;
};
