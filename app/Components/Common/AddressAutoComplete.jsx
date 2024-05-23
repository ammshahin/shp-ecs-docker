import {useState, useEffect, useContext, useRef} from 'react';
import {CrossIcon, PoweredByGoogleIcon} from '~/Components/Common';
import {CheckoutContext} from '~/Context';

export function AddressAutoComplete({
  selectedAddress,
  setSelectedAddress,
  register,
  clearErrors
}) {
  const {checkoutSessionToken, appUrl} = useContext(CheckoutContext);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestedAddresses, setSuggestedAddresses] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleInputChange = async (event) => {
    const {name, value} = event.target;
    setSelectedAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (value?.length > 0) {
      const suggestedAddressArray = await getSuggestedAddresses(value);
      setSuggestedAddresses(suggestedAddressArray);
      setIsOpen(true);
    }
  };

  const focusHandler = async (e) => {
    const {name, value} = event.target;
    clearErrors();
    if (value?.length > 0) {
      const suggestedAddressArray = await getSuggestedAddresses(value);
      setSuggestedAddresses(suggestedAddressArray);
      setIsOpen(true);
    }
  };

  const getSuggestedAddresses = async (query) => {
    try {
      const response = await fetch(
        `${appUrl?.endsWith('.com/') ? `${appUrl}api/predictive-address` : `${appUrl}/api/predictive-address`}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            sessionToken: checkoutSessionToken,
            countryCode: selectedAddress?.countryCodeV2,
          }),
        },
      );
      const {predictions} = (await response.json()) || {};
      return predictions;
    } catch (err) {
      console.error(err);
    }
  };

  const getAddressDetails = async (addressId) => {
    try {
      const response = await fetch(
        `${appUrl?.endsWith('.com/') ? `${appUrl}api/address-details` : `${appUrl}/api/address-details`}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addressId,
            sessionToken: checkoutSessionToken,
          }),
        },
      );
      const {address} = (await response.json()) || {};
      setSelectedAddress((prevState) => ({
        ...prevState,
        address1: address?.address1 || prevState?.address1 || '',
        address2: address?.address2 || prevState?.address2 || '',
        city: address?.city || '',
        country: address?.country || '',
        countryCodeV2: address?.countryCode || '',
        province: address?.province || '',
        provinceCode: address?.provinceCode || '',
        zip: address?.zip || '',
      }));
      setIsOpen(false);
      return address;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={ref} className="w-full h-full">
      <input
        // className="text-[#333333] h-[42px] font-Univers-Light text-sm mdl:text-base cursor-text mdl:h-[52px] w-full border border-[#D9D9D9] rounded-[5px]"
        className="focus:outline-none focus:ring-0 w-full border-none px-4 py-0"
        type="text"
        name="address1"
        id="address1"
        value={selectedAddress?.address1}
        placeholder="Address"
        autoComplete="shipping address"
        {...register('address1', {
          onChange: handleInputChange,
        })}
        onFocus={focusHandler}
      />
      {isOpen && (
        <div className="absolute top-full left-[-1px] right-0 w-[calc(100%+2px)] bg-white h-auto rounded-[4px] border border-[rgba(2,2,2,0.15)] box-border bg-clip-padding shadow-[0_6px_19px_0_rgba(0,0,0,0.23)] mt-1.5 z-50">
          <div className="w-full h-full overflow-y-auto flex flex-col justify-start items-start relative">
            <div className="p-[11px] w-full flex flex-row justify-between items-center">
              <h3 className="font-Eurostile-Next-Regular text-base">
                SUGGESTIONS
              </h3>
              <button
                className="close_btn"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <CrossIcon />
              </button>
            </div>
            <ul className="w-full list-none">
              {suggestedAddresses?.map((address) => {
                const matchedSubstring = address?.matchedSubstrings[0];
                const start = matchedSubstring?.offset;
                const end = start + matchedSubstring?.length;
                const description = address?.description;
                const beforeMatch = description?.slice(0, start);
                const match = description?.slice(start, end);
                const afterMatch = description?.slice(end);
                return (
                  <li
                    key={address?.addressId}
                    className="px-[10px] py-3 w-full flex flex-row justify-start items-center bg-white hover:bg-[#F5F5F5] cursor-pointer"
                    onClick={() => getAddressDetails(address?.addressId)}
                  >
                    <span className="font-Univers-Regular font-normal text-[#707070] inline-block whitespace-pre-wrap">
                      {beforeMatch}
                    </span>
                    <span className="matched_query text-black font-bold font-Univers-Bold inline-block whitespace-pre-wrap">
                      {match}
                    </span>
                    <span className="font-Univers-Regular font-normal text-[#707070] inline-block whitespace-pre-wrap">
                      {afterMatch}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="p-[11px] w-full flex flex-row justify-between items-center bg-[#F5F5F5]">
              <PoweredByGoogleIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
