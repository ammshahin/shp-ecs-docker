import {Fragment, useState, useContext, useEffect} from 'react';
import {AppProxyLink} from '@shopify/shopify-app-remix/react';
import {
  ArrowUp,
  CartIcon,
  Logo,
  Menu,
  SearchBar,
  MobileMenuTrigger,
  MobileMenuDrawer,
} from '~/Components/Common';
import {Link} from '@remix-run/react';
import {CheckoutContext} from '~/Context';
import {useViewport} from '~/Hooks';

export function Header({className = '', menu}) {
  const {isDesktop} = useContext(CheckoutContext);

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState('');

  const handleMouseEnter = (menuTitle) => {
    setDropdownVisible(true);
    setHoveredMenu(menuTitle);
  };

  const handleMouseLeave = (menuTitle) => {
    setDropdownVisible(false);
    setHoveredMenu(menuTitle);
  };

  return (
    <>
      <header
        className={`w-full flex flex-col justify-center items-center ${className} py-0 relative bg-[#FAFAFA]`}
      >
        <div className="page-width w-full flex flex-row justify-between items-center py-0">
          <div className="back_to_store_icon max-w-[calc(calc(100%/12)*2)] flex-[0_0_calc(calc(100%/12)*2)] md:max-w-[calc(100%/4)] md:flex-[0_0_calc(100%/4)] mdl:max-w-[calc(100%/3)] mdl:flex-[0_0_calc(100%/3)]">
            {isDesktop ? (
              <ul className="list-none hidden mdl:block">
                <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[.7rem] xlg:text-[.8rem] flex leading-[1] uppercase relative m-0">
                  <AppProxyLink
                    prefetch="intent"
                    href="https://losangelesapparel.net/"
                    className="consumer_link w-auto font-Eurostile-Next-Bold font-semibold text-black leading-[1] text-[.7rem] xlg:text-[.8rem] px-0 py-2 transition-all uppercase hover:text-[#585858] block"
                  >
                    <ArrowUp className="w-[30px] h-[20px] relative top-[3px] -mt-2 inline-block" />
                    {` Consumer Store `}
                  </AppProxyLink>
                </li>
              </ul>
            ) : (
              <ul className="list-none block mdl:hidden">
                <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[.7rem] xlg:text-[.8rem] flex leading-[1] uppercase relative m-0">
                  <MobileMenuTrigger
                    className={`hamburger_icon block mdl:hidden ${isMobileMenuVisible ? 'nav-is-visible' : ''}`}
                    isMobileMenuVisible={isMobileMenuVisible}
                    setMobileMenuVisible={setMobileMenuVisible}
                  />
                </li>
              </ul>
            )}
          </div>
          <div className="logo py-2 max-w-[calc(calc(100%/12)*8)] flex-[0_0_calc(calc(100%/12)*8)] md:max-w-[calc(100%/2)] md:flex-[0_0_calc(100%/2)] mdl:max-w-[calc(100%/3)] mdl:flex-[0_0_calc(100%/3)]">
            <AppProxyLink
              prefetch="intent"
              href="/"
              className="logo_image flex flex-row justify-center items-center w-[200px] max-md:h-[24px] xxs:w-[235px] md:w-[320px] xlg:w-[420px] my-0 mx-auto"
            >
              <Logo className="w-full block h-[inherit]" />
            </AppProxyLink>
          </div>
          <div className="max-w-[calc(calc(100%/12)*2)] flex-[0_0_calc(calc(100%/12)*2)] md:max-w-[calc(100%/4)] md:flex-[0_0_calc(100%/4)] mdl:max-w-[calc(100%/3)] mdl:flex-[0_0_calc(100%/3)] flex flex-row justify-end items-center">
            {isDesktop && (
              <ProfileMenu
                isDropdownVisible={isDropdownVisible}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                hoveredMenu={hoveredMenu}
                className="hidden mdl:block"
              />
            )}
            <div className="cart_icon w-auto">
              <AppProxyLink
                prefetch="intent"
                href="/cart/"
                className="cart_link flex flex-row justify-center items-center"
              >
                <CartIcon className="w-4 h-[16px] md:w-5 md:h-[20px] relative inline-block align-middle" />
              </AppProxyLink>
            </div>
          </div>
        </div>
        {isDesktop && (
          <>
            {menu && (
              <Menu
                menu={menu}
                isDropdownVisible={isDropdownVisible}
                setDropdownVisible={setDropdownVisible}
                isSearchVisible={isSearchVisible}
                setSearchVisible={setSearchVisible}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                hoveredMenu={hoveredMenu}
                setHoveredMenu={setHoveredMenu}
                className="hidden mdl:flex"
              />
            )}
            {isSearchVisible && (
              <SearchBar className="bg-white hidden mdl:block" />
            )}
          </>
        )}
      </header>
      {menu && isMobileMenuVisible && !isDesktop && (
        <MobileMenuDrawer menu={menu} className="flex mdl:hidden" />
      )}
    </>
  );
}

export function ProfileMenu({
  hoveredMenu,
  isDropdownVisible,
  handleMouseEnter,
  handleMouseLeave,
  className = '',
}) {
  const {customer, customerLoggedIn} = useContext(CheckoutContext);
  const profileMenuList = {
    items: [
      {
        title: 'My Account',
        url: '/pages/profile/',
      },
      {
        title: 'Order History',
        url: '/account/',
      },
      {
        title: 'Order Status',
        url: '/pages/order-status/',
      },
      {
        title: 'Download Price List',
        url: 'https://consumer-slider-imgs.s3.amazonaws.com/wp-content/uploads/2023/09/14191142/Wholesale-Price-List-9.13.23.pdf',
      },
      {
        title: 'Log Out',
        url: '/account/logout/',
      },
    ],
    title: 'profile',
  };

  return (
    <div className={`profile_menu_wrapper ${className}`}>
      <div className="account_menu relative">
        <ul className="list-none relative">
          <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[.7rem] xlg:text-[.8rem] leading-[1] uppercase relative m-0 mr-3">
            {!customerLoggedIn ? (
              <>
                <AppProxyLink
                  prefetch="intent"
                  href="/account/login/"
                  className="w-auto font-Eurostile-Next-Bold font-semibold text-black leading-[1] text-[.7rem] xlg:text-[.8rem] px-4 py-2 sm:px-2 transition-all uppercase hover:text-[#585858]"
                >
                  {` Log In `}
                </AppProxyLink>
                <AppProxyLink
                  prefetch="intent"
                  href="/account/register/"
                  className="w-auto font-Eurostile-Next-Bold font-semibold text-black leading-[1] text-[.7rem] xlg:text-[.8rem] px-4 py-2 sm:px-2 transition-all uppercase hover:text-[#585858]"
                >
                  {` Register `}
                </AppProxyLink>
              </>
            ) : (
              <span
                className="w-auto font-Eurostile-Next-Bold font-semibold text-black leading-[1] text-[.7rem] xlg:text-[.8rem] px-4 py-2 sm:px-2 transition-all uppercase hover:text-[#585858] after:content-[''] after:inline-block after:border-x-[0.3em] after:border-x-[transparent] after:border-b-0 after:border-t-[0.3em] after:ml-[.255em] after:align-[.255em]"
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={() => handleMouseLeave('')}
              >
                {` HI, ${customer?.firstName?.split(' ')?.[0]} ${customer?.firstName?.split(' ')?.[1] !== undefined ? customer?.firstName?.split(' ')?.[1]?.split('')?.[0] : customer?.lastName?.split(' ')?.[0]?.split('')?.[0]}`}
              </span>
            )}
          </li>
        </ul>
      </div>
      {hoveredMenu === 'profile' &&
        isDropdownVisible &&
        profileMenuList?.items?.length > 0 && (
          <DropdownMenu
            menu={profileMenuList?.items}
            className="top-1/2 right-12"
            onMouseEnter={() => handleMouseEnter('profile')}
            onMouseLeave={() => handleMouseLeave('')}
          />
        )}
    </div>
  );
}

export function DropdownMenu({
  menu,
  className = 'top-full left-0',
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <div
      className={`bg-[#fff] rounded-[5px] border border-[#000] transition-all absolute  m-0 py-2 px-0 w-auto z-[9999] text-left min-w-40 flex flex-col justify-start items-start bg-clip-padding ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className="list-none">
        {menu?.map((secondaryMenu) => {
          const DownloadProps = secondaryMenu?.title?.includes('Download')
            ? {
                download: 'Wholesale Price List',
                target: '_blank',
              }
            : null;
          return (
            <Fragment key={secondaryMenu?.title}>
              <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-sm flex leading-[100%] uppercase relative m-0">
                <AppProxyLink
                  prefetch="intent"
                  href={secondaryMenu?.url}
                  className="w-auto font-Eurostile-Next-Bold font-normal bg-transparent whitespace-nowrap block text-black text-sm px-2 py-1 transition-all uppercase hover:text-[#585858]"
                  {...DownloadProps}
                >
                  {secondaryMenu?.title}
                </AppProxyLink>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}
