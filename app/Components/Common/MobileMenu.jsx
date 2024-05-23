import {Fragment, useContext, useState} from 'react';
import {SearchBox} from './Search';
import {AppProxyLink} from '@shopify/shopify-app-remix/react';
import {
  PlusIcon,
  MinusIcon,
  PhoneIcon,
  MailIcon,
  FacebookIcon,
  InstagramIcon,
} from './Icons';
import {CheckoutContext} from '~/Context';

export function MobileMenuDrawer({menu, className = ''}) {
  return (
    <aside
      className={`fixed z-50 left-0 top-[40px] bottom-0 right-0 w-screen h-[calc(100dvh-40px)] overflow-hidden transition-all duration-300 ${className} justify-start items-start bg-white pt-[30px] overflow-y-scroll hidden-scrollbar`}
    >
      <nav className="w-full h-full flex flex-col justify-start items-center relative bg-transparent">
        <div className="menu_block search_block w-full">
          <SearchBox />
        </div>
        <div className="menu_block w-full">
          <MainMenuMobile menu={menu} />
        </div>
        <hr className="w-full border border-[#9a9a9a] my-4" />
        <div className="menu_block w-full">
          <ProfileMenuMobile />
        </div>
        <hr className="w-full border border-[#9a9a9a] my-4" />
        <div className="menu_block w-full">
          <ContactMenuMobile />
        </div>
        <hr className="w-full border border-[#9a9a9a] my-4" />
        <div className="menu_block w-full">
          <SocialMenuMobile />
        </div>
      </nav>
    </aside>
  );
}

function ContactMenuMobile({className = ''}) {
  return (
    <ul
      className={`flex flex-col justify-center items-start list-none max-mdl:px-[15px] max-mdl:m-0 ${className}`}
    >
      <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
        <AppProxyLink
          href="tel:+1-213-275-3120"
          className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]"
        >
          <PhoneIcon className="inline-block w-[15px] relative top-[-1px] align-middle h-[20px]" />
          <span className="inline-block ml-1">(213) 275-3120</span>
          <br />
          <span className="inline-block">Mon-Fri 9-5 PST</span>
        </AppProxyLink>
      </li>
      <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] relative m-0 py-[5px]">
        <AppProxyLink
          href="mailto:info@losangelesapparel.net"
          className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all hover:text-[#585858]"
        >
          <MailIcon className="inline-block w-[15px] relative align-middle h-[20px]" />
          <span className="inline-block ml-1">info@losangelesapparel.net</span>
        </AppProxyLink>
      </li>
    </ul>
  );
}

function SocialMenuMobile({className = ''}) {
  return (
    <ul
      className={`flex flex-row justify-center items-center gap-2 list-none max-mdl:px-[15px] max-mdl:m-0 pb-10 ${className}`}
    >
      <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
        <AppProxyLink
          href="https://www.facebook.com/LosAngelesApparel/"
          className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]"
        >
          <FacebookIcon className="inline-block w-5 relative top-[-1px] align-middle h-[20px]" />
        </AppProxyLink>
      </li>
      <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
        <AppProxyLink
          href="https://www.instagram.com/losangelesapparel/"
          className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]"
        >
          <InstagramIcon className="inline-block w-5 relative top-[-1px] align-middle h-[20px]" />
        </AppProxyLink>
      </li>
    </ul>
  );
}
function ProfileMenuMobile({menu}) {
  const {customer, shop, customerLoggedIn} = useContext(CheckoutContext);

  const profileMenuList = {
    items: [
      {
        title: 'My Account',
        url: `${shop?.primaryDomain?.url}/pages/profile/`,
      },
      {
        title: 'Order History',
        url: `${shop?.primaryDomain?.url}/account/`,
      },
      {
        title: 'Order Status',
        url: `${shop?.primaryDomain?.url}/pages/order-status/`,
      },
      {
        title: 'Download Price List',
        url: 'https://consumer-slider-imgs.s3.amazonaws.com/wp-content/uploads/2023/09/14191142/Wholesale-Price-List-9.13.23.pdf',
      },
      {
        title: 'Log Out',
        url: `${shop?.primaryDomain?.url}/account/logout/`,
      },
    ],
    title: 'profile',
  };

  return (
    <ul className="flex flex-col justify-center items-start list-none max-mdl:px-[15px] max-mdl:m-0">
      {customerLoggedIn ? (
        <>
          <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
            <span className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]">
              {` HI, ${customer?.firstName?.split(' ')?.[0]} ${customer?.firstName?.split(' ')?.[1]?.split('')?.[0]}`}
            </span>
          </li>
          {profileMenuList?.items?.map((profileMenu) => {
            return (
              <Fragment key={profileMenu?.title}>
                <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
                  <AppProxyLink
                    href={profileMenu?.url}
                    className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]"
                  >
                    {` ${profileMenu?.title} `}
                  </AppProxyLink>
                </li>
              </Fragment>
            );
          })}
        </>
      ) : (
        <>
          <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
            <AppProxyLink
              prefetch="intent"
              href={`${shop?.primaryDomain?.url}/account/login/`}
              className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]"
            >
              {` Log In `}
            </AppProxyLink>
          </li>
          <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
            <AppProxyLink
              prefetch="intent"
              href={`${shop?.primaryDomain?.url}/account/register/`}
              className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]"
            >
              {` Sign up `}
            </AppProxyLink>
          </li>
        </>
      )}
    </ul>
  );
}

function MainMenuMobile({menu}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickedMenu, setClickedMenu] = useState('');

  const menuClickHandler = (menuTitle) => {
    setClickedMenu(() => (clickedMenu !== '' ? '' : menuTitle));
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <ul className="flex flex-col justify-center items-start list-none max-mdl:px-[15px] max-mdl:m-0">
      {menu?.items?.map((primaryMenu) => {
        return (
          <Fragment key={primaryMenu?.title}>
            <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
              <span className="w-auto h-[30px] relative font-Eurostile-Next-Bold text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]">
                {` ${primaryMenu?.title} `}
              </span>
              <span
                className="inline-block"
                onClick={() => menuClickHandler(primaryMenu?.title)}
              >
                {primaryMenu?.items?.length > 0 &&
                  (clickedMenu === primaryMenu?.title && isMenuOpen ? (
                    <MinusIcon className="relative w-[15px] inline-block align-middle top-[-1px]" />
                  ) : (
                    <PlusIcon className="relative w-[15px] inline-block align-middle top-[-1px]" />
                  ))}
              </span>

              {clickedMenu === primaryMenu?.title &&
                primaryMenu?.items?.length > 0 &&
                isMenuOpen && (
                  <ul className="block list-none relative w-full pt-2.5 pl-2.5 pb-5">
                    {primaryMenu?.items?.map((secondaryMenu) => {
                      return (
                        <Fragment key={secondaryMenu?.title}>
                          <li className="w-auto font-Eurostile-Next-Bold font-normal text-black text-[1em] block text-left leading-[1] uppercase relative m-0 py-[5px]">
                            <AppProxyLink
                              prefetch="intent"
                              href={secondaryMenu?.url}
                              className="w-auto h-[30px] relative font-Eurostile-Next-Regular font-medium text-black leading-[1] text-[12.8px] max-mdl:mb-[15px] transition-all uppercase hover:text-[#585858]"
                            >
                              {secondaryMenu?.title}
                            </AppProxyLink>
                          </li>
                        </Fragment>
                      );
                    })}
                  </ul>
                )}
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
}
export function MobileMenuTrigger({
  isMobileMenuVisible,
  setMobileMenuVisible,
  className = '',
}) {
  const handleClick = () => {
    setMobileMenuVisible((prev) => !prev);
    if (!isMobileMenuVisible) {
      document.querySelector('body').classList.add('scroll-locked');
      document.querySelector('html').classList.add('scroll-locked');
    } else {
      document.querySelector('body').classList.remove('scroll-locked');
      document.querySelector('html').classList.remove('scroll-locked');
    }
  };

  return (
    <div
      className={`relative left-[-1px] indent-[-999em] w-7 h-[28px] border border-black rounded-[5px] ml-0 overflow-hidden whitespace-nowrap color-[transparent] hover:color-[#585858] menu-trigger ${className}`}
      onClick={handleClick}
    >
      Menu
      <span className="absolute top-1/2 left-1/2 ml-[-11px] mt-[-1px] transition-[background] duration-200"></span>
    </div>
  );
}
