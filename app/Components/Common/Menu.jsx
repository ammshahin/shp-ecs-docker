import {Fragment, useState} from 'react';
import {SearchIcon, DropdownMenu, SearchTrigger} from '~/Components/Common';

export function Menu({
  menu,
  isDropdownVisible,
  setDropdownVisible,
  handleMouseEnter,
  handleMouseLeave,
  hoveredMenu,
  setHoveredMenu,
  isSearchVisible,
  setSearchVisible,
  className = '',
}) {
  return (
    <div
      className={`header_menu_wrapper w-full justify-center items-center ${className}`}
    >
      <ul className="flex flex-row justify-center items-center list-none">
        {menu?.items?.map((primaryMenu) => {
          return (
            <Fragment key={primaryMenu?.title}>
              <li
                className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[.7rem] xlg:text-[.8rem] flex leading-[1] uppercase relative m-0"
                onMouseEnter={() => handleMouseEnter(primaryMenu?.title)}
                onMouseLeave={() => handleMouseLeave('')}
              >
                <span
                  className={`w-auto font-Eurostile-Next-Bold font-semibold text-black leading-[1] text-[.7rem] xlg:text-[.8rem] px-4 py-2 sm:px-2 transition-all uppercase hover:text-[#585858] ${primaryMenu?.items?.length > 0 ? "after:content-[''] after:inline-block after:border-x-[0.3em] after:border-x-[transparent] after:border-b-0 after:border-t-[0.3em] after:ml-[.255em] after:align-[.255em]" : ''}`}
                >
                  {` ${primaryMenu?.title} `}
                </span>
                {hoveredMenu === primaryMenu?.title &&
                  isDropdownVisible &&
                  primaryMenu?.items?.length > 0 && (
                    <DropdownMenu menu={primaryMenu?.items} />
                  )}
              </li>
            </Fragment>
          );
        })}
        <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[.7rem] xlg:text-[.8rem] flex leading-[1] uppercase relative m-0">
          <SearchTrigger
            isSearchVisible={isSearchVisible}
            setSearchVisible={setSearchVisible}
            className="w-auto font-Eurostile-Next-Bold font-semibold text-black leading-[1] text-[.7rem] xlg:text-[.8rem] px-4 py-2 sm:px-2 transition-all uppercase hover:text-[#585858] flex flex-row justify-start items-start gap-1"
          >
            <SearchIcon className="w-[15px] h-[15px] inline-block align-middle" />
            <span>{isSearchVisible ? 'Close' : 'Search'}</span>
          </SearchTrigger>
        </li>
      </ul>
    </div>
  );
}
