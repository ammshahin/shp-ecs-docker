import {useContext, useEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';
import {AddressAutoComplete, SelectOption} from '~/Components/Common';
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from 'react-country-region-selector';
import {ZodError, z} from 'zod';
import {useForm} from 'react-hook-form';
import {CheckoutContext} from '~/Context';

const addressFormValuesSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().min(1, {message: 'Please enter last name.'}),
  company: z.string().min(1, {message: 'Please enter your company name.'}),
  address1: z.string().min(1, {message: 'Please enter your address.'}),
  address2: z.string().optional(),
  country: z.string().min(1, {message: 'Please enter your country.'}),
  province: z.string().min(1, {message: 'Please enter your province.'}),
  city: z.string().min(1, {message: 'Please enter your city.'}),
  zip: z.string().min(1, {message: 'Please enter your zip code.'}),
  phone: z.string().min(1, {message: 'Please enter your phone number.'}),
});

let timer;
export function ShippingAddressBlock({className = ''}) {
  const fetcher = useFetcher();

  const {
    customer,
    shippingAddress,
    setShippingAddress,
    appUrl,
    checkoutSessionToken,
    setVerifiedShippingAddress,
  } = useContext(CheckoutContext);

  const [selectedSavedAddress, setSelectedSavedAddress] = useState('');
  const {
    register,
    formState: {errors},
    handleSubmit,
    setError,
    clearErrors,
  } = useForm({
    mode: 'all',
  });

  useEffect(() => {
    if (customer?.defaultAddress) {
      setShippingAddress(customer?.defaultAddress);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [customer]);

  useEffect(() => {
    const currentSelected =
      customer?.addresses?.find((address) => {
        return address?.name === selectedSavedAddress;
      }) || null;
    if (currentSelected) {
      setShippingAddress(currentSelected);
    }
  }, [selectedSavedAddress]);

  const verifyShippingAddress = async (address) => {
    try {
      const response = await fetch(
        `${appUrl?.endsWith('.com/') ? `${appUrl}api/address-validate` : `${appUrl}/api/address-validate`}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            sessionToken: checkoutSessionToken,
          }),
        },
      );
      const data = (await response.json()) || {};
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  function setErrorsFromConcerns(concerns) {
    concerns.forEach((concern) => {
      const fieldName = concern.fieldNames[0];
      const errorMessage = concern.message;
      setError(fieldName, {
        type: 'manual',
        message: errorMessage,
      });
    });
  }

  const onSubmit = async (values) => {
    try {
      const processedData = Object.fromEntries(
        Object.entries(shippingAddress).map(([key, value]) => [
          key,
          value === null ? '' : value,
        ]),
      );
      const {address1, zip, city, phone, provinceCode, countryCodeV2} =
        shippingAddress;
      if (address1 && zip && city && phone && provinceCode && countryCodeV2) {
        const validationResponse = await verifyShippingAddress({
          address1: shippingAddress.address1,
          zip: shippingAddress.zip,
          city: shippingAddress.city,
          phone: shippingAddress.phone,
          provinceCode: shippingAddress.provinceCode,
          countryCode: shippingAddress.countryCodeV2,
        });
        if (validationResponse.validation?.concerns?.length === 0) {
          setVerifiedShippingAddress(shippingAddress);
        } else {
          setErrorsFromConcerns(validationResponse.validation.concerns);
        }
        return;
      }
      addressFormValuesSchema.parse(processedData);
    } catch (error) {
      setVerifiedShippingAddress(null);
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          const message = err.message;
          setError(path, {
            type: 'manual',
            message,
          });
        });
      } else {
        console.error(error);
      }
    }
  };

  const getCountryWithProvinces = (countryCodeV2) => {
    const countryData = CountryRegionData?.find(
      (countryData) => countryData[1] === countryCodeV2,
    );

    if (countryData) {
      const countryName = countryData[0];

      const provinceData = countryData[2]?.split('|').map((province) => {
        const [provinceName, provinceCode] = province.split('~');
        return {province: provinceName, provinceCode: provinceCode};
      });

      return {
        countryName: countryName,
        provinces: provinceData,
      };
    }

    return null; // Country not found
  };

  const getProvinceFullName = (provinceCode, countryCodeV2) => {
    const countryData = getCountryWithProvinces(countryCodeV2);

    if (countryData) {
      const match = countryData.provinces.find(
        (prov) => prov.provinceCode === provinceCode,
      );
      return match ? match.province : null;
    }

    return null;
  };

  // Event handler for input field changes
  const handleInputChange = (event, typename) => {
    clearErrors();
    if (typename === 'countryCodeV2') {
      const {countryName, provinces} = getCountryWithProvinces(event);

      setShippingAddress((prevState) => ({
        ...prevState,
        country: countryName,
        countryCodeV2: event,
        province: provinces[0].province,
        provinceCode: provinces[0].provinceCode,
      }));
    } else if (typename === 'provinceCode') {
      const provinceName = getProvinceFullName(
        event,
        shippingAddress?.countryCodeV2,
      );

      setShippingAddress((prevState) => ({
        ...prevState,
        province: provinceName,
        provinceCode: event,
      }));
    } else {
      const {name, value} = event.target;
      setShippingAddress((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <fetcher.Form
      className={`w-full ${className}`}
      method={
        shippingAddress?.id && shippingAddress?.id !== 'new' ? 'PUT' : 'POST'
      }
      onSubmit={handleSubmit(onSubmit)}
      onBlur={() => {
        handleSubmit(onSubmit)();
      }}
      id={shippingAddress?.id}
    >
      <div className="relative box-border mb-2 mdl:mb-5 flex-[1_1_auto]">
        <h2 className="font-Eurostile-Next-Bold text-black text-base mdl:text-[20px] leading-normal tracking-[-0.4px] flex-[1_1_auto]">
          Shipping Address
        </h2>
      </div>
      <div className="w-full relative flex flex-col justify-start items-start gap-[11px]">
        <div className="w-full max-h-[42px] mdl:max-h-[52px] relative saved_address">
          <SelectOption
            options={customer?.addresses}
            label="Saved addresses"
            className="h-[42px] mdl:h-[52px] pt-[19.2px] pb-[4.5px] pl-[10px] pr-[26.5px]"
            value={selectedSavedAddress}
            setValue={setSelectedSavedAddress}
          />
        </div>
        <div className="w-full">
          <div className="max-h-[42px] mdl:max-h-[52px] relative country">
            <label
              htmlFor="country"
              className="absolute text-xs top-0 w-full font-normal my-[5px] text-[#737373] transition-all px-2.5 z-[1] pointer-events-none whitespace-nowrap overflow-ellipsis box-border"
            >
              Country/region
            </label>
            <CountryDropdown
              aria-label="Country"
              autoComplete="country-name"
              value={shippingAddress?.countryCodeV2}
              id="country"
              name="country"
              priorityOptions={['CA', 'US']}
              defaultOptionLabel={shippingAddress?.country}
              placeholder="Country/region"
              onChange={(val) => handleInputChange(val, 'countryCodeV2')}
              showDefaultOption={true}
              valueType="short"
              labelType="full"
              classes={`${
                errors?.country?.message
                  ? '!border-[#FC0000] focus:!outline-none focus:!shadow-none'
                  : 'border-[#DCDCDC]'
              } max-w-full w-full pt-[19.2px] pb-[4.5px] pl-[10px] pr-[26.5px] border border-[#D9D9D9] text-[#333333] bg-white rounded-[5px] h-[42px] font-Univers-Light text-sm mdl:text-base cursor-text mdl:h-[52px] text-sm cursor-pointer`}
            />
          </div>
          {errors?.country && (
            <p className="text-[#E62828] text-sm">{errors?.country.message}</p>
          )}
        </div>

        <div className="w-full grid md:grid-cols-2 gap-2">
          <div>
            <div
              className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${errors?.firstName === ('invalid_type' || 'manual') ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
            >
              <div className="flex flex-col justify-center basis-11/12">
                {shippingAddress?.firstName && (
                  <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                    First Name
                  </p>
                )}
                <input
                  className="focus:outline-none focus:ring-0 w-full border-none px-4 py-0"
                  type="text"
                  name="firstName"
                  id="first_name"
                  value={shippingAddress?.firstName}
                  placeholder="First Name"
                  autoComplete="shipping given-name"
                  onChange={handleInputChange}
                  onFocus={() => clearErrors()}
                />
              </div>
              {errors?.firstName && (
                <p className="text-[#E62828] text-sm">
                  {errors?.firstName.message}
                </p>
              )}
            </div>
            {errors?.firstName && (
              <p className="text-[#E62828] text-sm">
                {errors?.firstName.message}
              </p>
            )}
          </div>
          <div>
            <div
              className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${errors?.lastName ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
            >
              <div className="flex flex-col justify-center basis-11/12">
                {shippingAddress?.lastName && (
                  <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                    Last Name
                  </p>
                )}
                <input
                  // className="text-[#333333] h-[42px] font-Univers-Light text-sm mdl:text-base cursor-text mdl:h-[52px] w-full border border-[#D9D9D9] rounded-[5px]"
                  className="focus:outline-none focus:ring-0 w-full border-none px-4 py-0"
                  type="text"
                  name="lastName"
                  value={shippingAddress?.lastName}
                  id="last_name"
                  placeholder="Last Name"
                  autoComplete="shipping given-name"
                  onChange={handleInputChange}
                  onFocus={() => clearErrors()}
                />
              </div>
            </div>
            {errors?.lastName && (
              <p className="text-[#E62828] text-sm">
                {errors?.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-full">
          <div
            className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${errors?.company ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
          >
            <div className="flex flex-col justify-center basis-11/12">
              {shippingAddress?.company && (
                <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                  Company
                </p>
              )}
              <input
                className="focus:outline-none focus:ring-0 w-full border-none px-4 py-0"
                type="text"
                name="company"
                id="company_name"
                placeholder="Company"
                autoComplete="shipping company"
                onChange={handleInputChange}
                value={shippingAddress?.company}
                onFocus={() => clearErrors()}
              />
            </div>
          </div>
          {errors?.company && (
            <p className="text-[#E62828] text-sm">{errors?.company.message}</p>
          )}
        </div>
        <div className="w-full">
          <div
            className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${errors?.address1 ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
          >
            <div className="flex flex-col justify-center basis-11/12 relative">
              {shippingAddress?.address1 && (
                <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                  Address
                </p>
              )}
              <AddressAutoComplete
                selectedAddress={shippingAddress}
                setSelectedAddress={setShippingAddress}
                register={register}
                clearErrors={clearErrors}
              />
            </div>
          </div>
          {errors?.address1 && (
            <p className="text-[#E62828] text-sm">{errors?.address1.message}</p>
          )}
        </div>
        <div className="w-full">
          <div
            className={`bg-[#FFF] min-h-[52px] rounded flex justify-between border border-[#DEDEDE]`}
          >
            <div className="flex flex-col justify-center basis-11/12 relative">
              {shippingAddress?.address2 && (
                <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                  Apartment, suite, etc. (optional)
                </p>
              )}
              <input
                className="focus:outline-none focus:ring-0  w-full border-none px-4 py-0"
                type="text"
                name="address2"
                id="address2"
                value={shippingAddress?.address2}
                placeholder="Apartment, suite, etc. (optional)"
                autoComplete="shipping address2"
                onChange={handleInputChange}
                onFocus={() => clearErrors()}
              />
            </div>
          </div>
        </div>
        <div className="city_state_zip w-full grid md:grid-cols-3 gap-2">
          <div className="w-full">
            <div
              className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${errors?.city ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
            >
              <div className="flex flex-col justify-center basis-11/12">
                {shippingAddress?.city && (
                  <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                    City
                  </p>
                )}
                <input
                  className="focus:outline-none focus:ring-0  w-full border-none px-4 py-0"
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  value={shippingAddress?.city}
                  autoComplete="shipping city"
                  onChange={handleInputChange}
                  onFocus={() => clearErrors()}
                />
              </div>
            </div>
            {errors?.city && (
              <p className="text-[#E62828] text-sm">{errors?.city.message}</p>
            )}
          </div>
          <div className="w-full">
            <div
              className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${errors?.city ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
            >
              <div className="w-full flex flex-col justify-center relative">
                {shippingAddress?.province && (
                  <label
                    htmlFor="province"
                    className="absolute text-xs top-0 w-full font-normal my-[5px] text-[#737373] transition-all px-2.5 z-[1] pointer-events-none whitespace-nowrap overflow-ellipsis box-border"
                  >
                    State
                  </label>
                )}
                <RegionDropdown
                  country={shippingAddress?.countryCodeV2}
                  value={shippingAddress?.provinceCode}
                  aria-label="State"
                  autoComplete="address-level1"
                  blankOptionLabel={'State'}
                  id="province"
                  name="province"
                  showDefaultOption={true}
                  countryValueType="short"
                  valueType="short"
                  labelType="full"
                  defaultOptionLabel={shippingAddress?.province}
                  placeholder="State"
                  onChange={(val) => handleInputChange(val, 'provinceCode')}
                  className={`focus:outline-none focus:ring-0  w-full border-none ${shippingAddress?.province && 'pt-[19.2px]'} cursor-pointer`}
                  onFocus={() => clearErrors()}
                />
              </div>
            </div>
            {errors?.province && (
              <p className="text-[#E62828] text-sm">
                {errors?.province.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <div
              className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${errors?.zip ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
            >
              <div className="flex flex-col justify-center basis-11/12">
                {shippingAddress?.zip && (
                  <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                    ZIP code
                  </p>
                )}
                <input
                  className="focus:outline-none focus:ring-0  w-full border-none px-4 py-0"
                  type="text"
                  name="zip"
                  id="zip_code"
                  placeholder="ZIP code"
                  value={shippingAddress?.zip}
                  autoComplete="shipping zip-code"
                  onChange={handleInputChange}
                  onFocus={() => clearErrors()}
                />
              </div>
            </div>
            {errors?.zip && (
              <p className="text-[#E62828] text-sm">{errors?.zip.message}</p>
            )}
          </div>
        </div>

        <div className="w-full">
          <div
            className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${errors?.city ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
          >
            <div className="flex flex-col justify-center basis-11/12">
              {shippingAddress?.phone && (
                <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                  Phone
                </p>
              )}
              <input
                className="focus:outline-none focus:ring-0  w-full border-none px-4 py-0"
                type="text"
                name="phone"
                id="phone_number"
                value={shippingAddress?.phone}
                placeholder="Phone"
                autoComplete="shipping phone"
                onChange={handleInputChange}
                onFocus={() => clearErrors()}
              />
            </div>
          </div>
          {errors?.phone && (
            <p className="text-[#E62828] text-sm">{errors?.phone.message}</p>
          )}
        </div>
      </div>
    </fetcher.Form>
  );
}
