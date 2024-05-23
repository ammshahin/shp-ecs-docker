import {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {CheckoutContext} from '~/Context';
import {SearchIcon} from '~/Components/Common';
import {Link} from '@remix-run/react';

export function SearchBox({className = ''}) {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const {shop} = useContext(CheckoutContext);
  const searchResultsRef = useRef(null);
  const timeoutRef = useRef(null);

  const getSearchResult = async (searchValue) => {
    const cacheKey = `searchResult_${searchValue}`;

    // Check if the search result is already cached
    const cachedResult = localStorage.getItem(cacheKey);
    if (cachedResult) {
      setSearchResult(JSON.parse(cachedResult));
      return;
    }

    try {
      const response = await fetch(
        `${shop?.primaryDomain?.url}/search/suggest.json?options[prefix]=last&type=product&q=${searchValue}`,
      );
      const result = await response.json();
      const products = result?.resources?.results?.products;

      // Cache the search result
      localStorage.setItem(cacheKey, JSON.stringify(products));

      // Set the search result state
      setSearchResult(products);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear previous timeout
    clearTimeout(timeoutRef.current);

    // Set a new timeout to execute getSearchResult after 300ms
    timeoutRef.current = setTimeout(() => {
      if (value.length > 0) {
        getSearchResult(value);
      } else {
        setSearchResult(null); // Clear search results if input is empty
      }
    }, 200);
  };

  useEffect(() => {
    return () => {
      // Clear the timeout when component unmounts
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClickOutside = (event) => {
    // Close search results if the click is outside the search results container
    if (
      searchResultsRef.current &&
      searchResultsRef.current.contains(event.target)
    ) {
      setSearchResult(null);
    }
  };

  return (
    <form
      action={`${shop?.primaryDomain?.url}/search`}
      method="get"
      role="search"
      className="relative flex flex-col flex-wrap items-center flow pb-[25px] px-[15px] xs:py-2.5 xs:pr-[17px] xs:pl-[20px]"
      data-hs-cf-bound="true"
    >
      <input type="hidden" name="options[prefix]" value="last" />
      <input type="hidden" name="type" value="product" />
      <div className="flex items-center mb-0 flex-row flex-wrap flex-[0_0_auto] w-full xs:w-[400px]">
        <label htmlFor="Search" className="sr-only label-hidden">
          Search
        </label>
        <input
          type="search"
          name="q"
          className="bg-[#FBFBFB] appearance-none -outline-offset-2 h-[calc(1.5em+.75rem+2px)] bg-clip-padding transition-[border-color] ease-in-out leading-[1.5] font-normal rounded-none border-x-0 border-t-0 border-b-[1px] text-black border-[#000] py-[.375rem] px-[.45rem] text-[.75rem] inline-block align-middle w-full xs:w-[400px] bg-[transparent] focus:shadow-none focus:outline-none focus:border-[#000]"
          id="Search"
          value={searchValue}
          onChange={handleChange}
          onFocus={() => {
            if (searchValue?.length > 0) getSearchResult(searchValue);
          }}
          placeholder="Search"
          autoComplete="off"
          onBlur={handleClickOutside}
        />
        <button type="submit" className="sr-only btn btn-primary btn-outline">
          <SearchIcon />
          <span className="icon-fallback-text">Search</span>
        </button>
      </div>
      <div
        ref={searchResultsRef}
        className={`search-results top-[31px] z-50 w-full h-[calc(100vh-113px)] bg-[#fff] border-none overflow-hidden ${searchResult?.length > 0 ? 'flex justify-center items-center flex-row flex-wrap flex-[0_0_auto]' : 'hidden'}`}
        onClick={handleClickOutside}
      >
        <ul className="search-results top-[31px] z-50 w-[470px] h-[calc(100vh-113px)] list-none m-0 py-10 px-0 bg-[#fff] border-none overflow-scroll overflow-x-hidden overflow-y-auto">
          {searchResult?.map((result) => {
            return (
              <Fragment key={result?.title}>
                <li className="block py-[3px] max-w-[470px] w-full">
                  <Link
                    to={result?.url}
                    className="flex flex-row justify-start items-center"
                  >
                    <span className="flex justify-center items-center mr-2.5 w-[50px] h-[50px]">
                      <img
                        className="align-middle border-none transition-all"
                        src={result?.image}
                      />
                    </span>
                    <span className="flex justify-start items-center text-left uppercase max-w-[340px]">
                      {result?.title}
                    </span>
                  </Link>
                </li>
              </Fragment>
            );
          })}
        </ul>
      </div>
    </form>
  );
}
export function SearchBar({className = ''}) {
  return (
    <div
      className={`absolute top-full left-0 right-0 z-50 w-full translate-x-0 translate-y-0 ${className}`}
    >
      <SearchBox />
    </div>
  );
}

export function SearchTrigger({
  isSearchVisible,
  setSearchVisible,
  className,
  children,
}) {
  const clickHandler = () => {
    setSearchVisible((prev) => !prev);
    if (!isSearchVisible) {
      document.querySelector('body').classList.add('scroll-locked');
      document.querySelector('html').classList.add('scroll-locked');
    } else {
      document.querySelector('body').classList.remove('scroll-locked');
      document.querySelector('html').classList.remove('scroll-locked');
    }
  };

  return (
    <div className={`cursor-pointer ${className}`} onClick={clickHandler}>
      {children}
    </div>
  );
}
