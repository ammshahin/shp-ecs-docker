import {useFetcher} from '@remix-run/react';
import {useCallback, useContext, useEffect, useState} from 'react';
import {CheckoutContext} from '~/Context';
import {DRAFT_ORDER_CALCULATE_MUTATION} from '~/Shopify';

export function ShippingBlock() {
  const fetcher = useFetcher();
  const {
    shippingAddress,
    customer,
    lineItems,
    selectedShippingMethod,
    setSelectedShippingMethod,
    draftOrder,
  } = useContext(CheckoutContext);
  const [shippingMethods, setShippingMethods] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useOwnAccount, setUseOwnAccount] = useState(false);
  const [activeShipping, setActiveShipping] = useState(null);

  const lineItemsArray = lineItems?.map((lineItem) => {
    return {
      variantId: lineItem?.variant?.id,
      quantity: lineItem?.quantity,
    };
  });

  const shippingAddressObject = {
    address1: shippingAddress?.address1,
    address2: shippingAddress?.address2,
    city: shippingAddress?.city,
    company: shippingAddress?.company,
    phone: shippingAddress?.phone,
    zip: shippingAddress?.zip,
    provinceCode: shippingAddress?.provinceCode,
    countryCode: shippingAddress?.countryCodeV2,
  };

  const getShippingMethod = async () => {
    try {
      if (!customer?.email || !lineItems) return false;

      const ShippingMethodRequest = {
        query: DRAFT_ORDER_CALCULATE_MUTATION,
        options: {
          variables: {
            input: {
              shippingAddress: shippingAddressObject,
              email: customer?.email,
              lineItems: lineItemsArray,
            },
          },
        },
        client: 'admin',
      };

      fetcher.submit(
        {
          body: JSON.stringify(ShippingMethodRequest),
        },
        {method: 'post', action: '/a/checkout'},
      );
      const result = fetcher.data || {};
      if (result?.status === 500) throw result;
      return {data: result};
    } catch (error) {
      console.error('error', error);
      return {error: error.message};
    }
  };

  useEffect(() => {
    setIsLoading(false);
    if (fetcher.state === 'submitting') {
      setIsLoading(true);
    }
    const result = fetcher.data || {};

    if (result?.status === 200)
      setShippingMethods(
        result?.data?.draftOrderCalculate?.calculatedDraftOrder
          ?.availableShippingRates,
      );
  }, [fetcher]);

  useEffect(() => {
    const resolveShippingPromise = async () => {
      const calculatedDraftOrder = await getShippingMethod();
      return calculatedDraftOrder;
    };
    resolveShippingPromise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress]);

  useEffect(() => {
    if (shippingMethods?.length && !activeShipping) {
      setActiveShipping(shippingMethods[0]);
      setSelectedShippingMethod(shippingMethods[0]);
    }
    const VIPTag = 'fedexaccount';
      if (customer && customer?.tags?.includes(VIPTag)) {
        VIPDiscountProvider('0.0');
      }
  }, [shippingMethods, activeShipping]);

  const VIPDiscountProvider = (newPrice) => {
    const newState = {...activeShipping};
    newState.price = {
      amount: newPrice,
      currencyCode: selectedShippingMethod?.price?.currencyCode,
    };
    setSelectedShippingMethod(newState);
    return newState;
  };

  const changeHandler = (shipping) => {
    setActiveShipping(shipping);
    setSelectedShippingMethod(shipping);
    const VIPTag = 'fedexaccount';
    if (customer && customer?.tags?.includes(VIPTag)) {
      VIPDiscountProvider('0.0');
    }
  };

  return (
    <div className="w-full sm:w-10/12 md:w-full m-auto flex flex-col gap-2">
      <div className="relative box-border mb-5 flex flex-col gap-2">
        <h2 className="font-Eurostile-Next-Bold text-black text-[20px] leading-normal tracking-[-0.4px] flex-[1_1_auto]">
          Shipping Method
        </h2>
        {shippingMethods && (
          <div className="flex items-center gap-2">
            <input
              className="custom-input rounded"
              type="checkbox"
              checked={useOwnAccount}
              onChange={() => setUseOwnAccount(!useOwnAccount)}
            />
            <p className="text-sm">Use My Account</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {!isLoading ? (
          shippingMethods?.length ? (
            shippingMethods.map((shipping) => (
              <div
                key={shipping.handle}
                className="flex justify-between rounded-md py-2 px-4 border border-[#DEDEDE]"
              >
                <div className="flex items-center gap-3">
                  <input
                    className="custom-checkbox"
                    checked={activeShipping?.handle === shipping.handle}
                    type="radio"
                    onChange={() => changeHandler(shipping)}
                  />
                  <div>
                    <p className="text-sm text-[#707070]">{shipping.title}</p>
                  </div>
                </div>
                {+shipping.price.amount === 0 ? (
                  <p className="text-md text-[#707070]">Free</p>
                ) : (
                  <p className="text-md text-[#707070]">
                    ${shipping.price.amount}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-md py-4 px-4 border border-[#DEDEDE]">
              <p>Shipping methods not found</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-md py-4 px-4 border border-[#DEDEDE]">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <p>Getting available shipping rates…</p>
          </div>
        )}
      </div>
    </div>
  );
}
