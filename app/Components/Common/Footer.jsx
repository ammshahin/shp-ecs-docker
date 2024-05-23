import React from 'react';
import {ArrowIcon, PhoneIcon} from './Icons';

export function Footer({className = ''}) {
  return (
    <footer className="w-full text-black">
      <div className="max-w-screen-xl mx-auto bg-white min-h-sceen">
        <div className="md:hidden grid max-w-xl mx-auto">
          <div className="px-3 py-4 border-t-[1px] border-black-200">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="font-Eurostile-Next-Bold text-sm">Help</span>
                <span className="md:hidden transition group-open:rotate-180">
                  <ArrowIcon />
                </span>
              </summary>
              <ul className="mt-3 p-0">
                <li className="m-0 leading-tight">
                  <a
                    href="tel:213-275-3120"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    <span className="flex gap-1">
                      <PhoneIcon className="inline-block w-[15px] relative top-[1px] align-middle h-[12px]" />{' '}
                      +1 213 275 3120
                    </span>{' '}
                    Mon-Fri 9-5 PST
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="mailto:info@losangelesapparel.net"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    info@losangelesapparel.net
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/terms-conditions"
                    className="no-underline text-xs text-black"
                  >
                    Terms of Service
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/policies"
                    className="no-underline text-xs text-black"
                  >
                    Policies
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/cookie-policy"
                    className="no-underline text-xs text-black"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </details>
          </div>
          <div className="px-3 py-4 border-t-[1px] border-black-200">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="font-Eurostile-Next-Bold text-sm">
                  Ordering
                </span>
                <span className="transition group-open:rotate-180">
                  <ArrowIcon />
                </span>
              </summary>
              <ul className="mt-3 p-0">
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/returns"
                    className="no-underline text-xs text-black"
                  >
                    Returns
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://consumer-slider-imgs.s3.amazonaws.com/wp-content/uploads/2023/09/14191142/Wholesale-Price-List-9.13.23.pdf"
                    target="_blank"
                    download="download"
                    className="no-underline text-xs text-black"
                  >
                    Download Price List
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/add-user"
                    className="no-underline text-xs text-black"
                  >
                    Add Web User
                  </a>
                </li>
              </ul>
            </details>
          </div>
          <div className="px-3 py-4 border-t-[1px] border-black-200">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="font-Eurostile-Next-Bold text-sm">
                  About Us
                </span>
                <span className="transition group-open:rotate-180">
                  <ArrowIcon />
                </span>
              </summary>
              <ul className="mt-3 p-0">
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/our-values"
                    className="no-underline text-xs text-black"
                  >
                    Our Values
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/press"
                    className="no-underline text-xs text-black"
                  >
                    Press
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/videos"
                    className="no-underline text-xs text-black"
                  >
                    Videos
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/contact-us"
                    className="no-underline text-xs text-black"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </details>
          </div>
          <div className="px-3 py-4 border-y-[1px] border-black-200">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="font-Eurostile-Next-Bold text-sm">
                  Social Links
                </span>
                <span className="transition group-open:rotate-180">
                  <ArrowIcon />
                </span>
              </summary>
              <ul className="mt-3 p-0">
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.instagram.com/losangelesapparel/"
                    target="_blank"
                    className="no-underline text-xs text-black"
                  >
                    Instagram - Official
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.instagram.com/dovcharney_losangeles/?hl=en"
                    target="_blank"
                    className="no-underline text-xs text-black"
                  >
                    Instagram - Dov
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.instagram.com/losangelesapparel_insights/"
                    target="_blank"
                    className="no-underline text-xs text-black"
                  >
                    Instagram Insights #1
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.facebook.com/LosAngelesApparel/"
                    target="_blank"
                    className="no-underline text-xs text-black"
                  >
                    Facebook
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.linkedin.com/company/los-angeles-apparel-imprintable/"
                    target="_blank"
                    className="no-underline text-xs text-black"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </details>
          </div>
        </div>
        <div className="hidden md:block p-4 border-t-[1px] border-black-200">
          <div className="flex justify-between max-w-[992px] m-auto">
            <div className="p-2">
              <p className="pb-2 font-Eurostile-Next-Bold text-sm">Help</p>
              <ul className="">
                <li className="m-0 leading-tight">
                  <a
                    href="tel:213-275-3120"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    <span className="flex gap-1">
                      <PhoneIcon className="inline-block w-[15px] relative top-[1px] align-middle h-[12px]" />{' '}
                      +1 213 275 3120
                    </span>{' '}
                    Mon-Fri 9-5 PST
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="mailto:info@losangelesapparel.net"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    info@losangelesapparel.net
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/terms-conditions"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Terms of Service
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/policies"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Policies
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/cookie-policy"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="p-2">
              <p className="pb-2 font-Eurostile-Next-Bold text-sm">Ordering</p>
              <ul className="">
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/returns"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Returns
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://consumer-slider-imgs.s3.amazonaws.com/wp-content/uploads/2023/09/14191142/Wholesale-Price-List-9.13.23.pdf"
                    target="_blank"
                    download="download"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Download Price List
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/add-user"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Add Web User
                  </a>
                </li>
              </ul>
            </div>
            <div className="p-2">
              <p className="pb-2 font-Eurostile-Next-Bold text-sm">About Us</p>

              <ul className="">
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/our-values"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Our Values
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/press"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Press
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/videos"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Videos
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://imprintable.losangelesapparel.net/pages/contact-us"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="p-2">
              <p className="pb-2 font-Eurostile-Next-Bold text-sm">
                Social Links
              </p>
              <ul className="">
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.instagram.com/losangelesapparel/"
                    target="_blank"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Instagram - Official
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.instagram.com/dovcharney_losangeles/?hl=en"
                    target="_blank"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Instagram - Dov
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.instagram.com/losangelesapparel_insights/"
                    target="_blank"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Instagram Insights #1
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.facebook.com/LosAngelesApparel/"
                    target="_blank"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    Facebook
                  </a>
                </li>
                <li className="m-0 leading-tight">
                  <a
                    href="https://www.linkedin.com/company/los-angeles-apparel-imprintable/"
                    target="_blank"
                    className="no-underline font-Univers-Regular text-xs text-black"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 md:px-12 md:pb-6">
        <p className="pb-2 font-Eurostile-Next-Bold text-[11px]">
          &copy; {new Date().getFullYear()} Los Angeles Apparel Inc.
          <br />
          1020 E 59th St, Los Angeles, CA 90001
          <br />
          Made in South Central, Los Angeles
        </p>
      </div>
    </footer>
  );
}
