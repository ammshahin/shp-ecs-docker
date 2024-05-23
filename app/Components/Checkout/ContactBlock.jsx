import {AppProxyLink} from '@shopify/shopify-app-remix/react';
import {useContext, useEffect, useState} from 'react';
import {CheckoutContext} from '~/Context';
import {NoProfileImageIcon, Checkbox} from '~/Components/Common';
import {getDateTimeNow} from '~/lib/utils';
import {useFetcher, useActionData} from '@remix-run/react';
import {
  CUSTOMER_MARKETING_CONSENT_UPDATE,
  DRAFT_ORDER_QUERY,
  GET_CUSTOMER_BY_EMAIL,
} from '~/Shopify';

export function ContactBlock({className = ''}) {
  const fetcher = useFetcher();
  const {customer, setCustomer, customerLoggedIn, setLineItems, setDraftOrder} =
    useContext(CheckoutContext);
  const [acceptsMarketing, setAcceptsMarketing] = useState(
    Boolean(customer?.emailMarketingConsent?.marketingState === 'SUBSCRIBED') ||
      customer?.id === undefined,
  );
  const [email, setEmail] = useState(customer?.email ?? '');

  const getOrderDataByCustomer = async (id) => {
    try {
      if (!id)
        return {draftOrder: null, message: 'Customer ID is not present!'};
      const draftOrderRequestBody = {
        query: DRAFT_ORDER_QUERY,
        options: {
          variables: {
            first: 1,
            reverse: true,
            sortKey: 'UPDATED_AT',
            query: `customer_id:${id}`,
          },
        },
        client: 'admin',
      };

      fetcher.submit(
        {
          body: JSON.stringify(draftOrderRequestBody),
        },
        {
          method: 'POST',
          action: '/a/checkout',
        },
      );

      const isSubmitted = fetcher.state === 'idle';
      if (isSubmitted) {
        const {data, status} = (await fetcher.data) || {};
        if (status === 500) throw data;
        const draftOrderData = (await data?.draftOrders?.nodes[0]) || null;
        if (!draftOrderData) {
          return null;
        }

        setDraftOrder(draftOrderData);
        return draftOrderData;
      }
      return null;
    } catch (error) {
      console.error('error', error);
      return {error: error.message};
    }
  };

  const getCustomerByEmail = async () => {
    try {
      if (email?.length < 5)
        return {customer: null, message: 'Email is not present!'};
      if (customer?.id) {
        return {customer, message: 'Customer data is Already Present!'};
      }
      const customerRequestBody = {
        query: GET_CUSTOMER_BY_EMAIL,
        options: {
          variables: {
            query: email,
          },
        },
        client: 'admin',
      };

      fetcher.submit(
        {
          body: JSON.stringify(customerRequestBody),
        },
        {
          method: 'POST',
          action: '/a/checkout',
        },
      );

      const isSubmitted = fetcher.state === 'idle';
      if (isSubmitted) {
        const {data, status} = (await fetcher.data) || {};
        if (status === 500) throw data;
        const customerData = (await data?.customers?.nodes[0]) || null;
        if (!customerData) {
          return null;
        }
        setCustomer((prev) => ({
          ...prev,
          ...customerData,
        }));
        return data?.customers;
      }
      return null;
    } catch (error) {
      console.error('error', error);
      return {error: error.message};
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedGetCustomerByEmail = debounce(() => {
    getCustomerByEmail();
    getOrderDataByCustomer();
  }, 300);

  const handleInputChange = (event) => {
    const {value} = event.target || {};
    setEmail(value);
  };

  const customerMarketingSubscriptionUpdater = async () => {
    try {
      if (!customer?.id) return false;
      const customerMarketingUpdate = {
        query: CUSTOMER_MARKETING_CONSENT_UPDATE,
        options: {
          variables: {
            input: {
              customerId: customer?.id,
              emailMarketingConsent: {
                consentUpdatedAt: getDateTimeNow(),
                marketingOptInLevel: 'SINGLE_OPT_IN',
                marketingState: acceptsMarketing
                  ? 'SUBSCRIBED'
                  : 'UNSUBSCRIBED',
              },
            },
          },
        },
        client: 'admin',
      };
      await fetcher.submit(
        {
          body: JSON.stringify(customerMarketingUpdate),
        },
        {
          method: 'POST',
          action: '/a/checkout',
        },
      );
      const {data, status} = (await fetcher.data) || {};
      if (status === 500) throw data;

      return data;
    } catch (error) {
      console.error('error', error);
      return {error: error.message};
    }
  };

  useEffect(() => {
    customerMarketingSubscriptionUpdater();
    if (customer?.id) {
      const customerNumericId = customer?.id?.replace(
        'gid://shopify/Customer/',
        '',
      );
      getOrderDataByCustomer(customerNumericId);
    }
  }, [acceptsMarketing, customer]);

  useEffect(() => {
    debouncedGetCustomerByEmail();
  }, [email]);

  return (
    <div
      className={`w-full flex flex-col items-baseline box-border flex-wrap ${className}`}
    >
      <div className="w-full relative box-border mb-5 flex-[1_1_auto] flex flex-row justify-between items-center">
        <h2 className="font-Eurostile-Next-Bold text-black text-base mdl:text-[20px] leading-normal tracking-[-0.4px] flex-[1_1_auto]">
          Contact
        </h2>
        {!customerLoggedIn && (
          <AppProxyLink
            className="font-Univers-Regular text-[12.8px] underline"
            href="/account/login/"
          >
            Log in
          </AppProxyLink>
        )}
      </div>
      <div className="w-full box-border flex flex-col justify-start items-start gap-5">
        {customerLoggedIn ? (
          <div className="relative flex flex-row justify-start items-center gap-3">
            <div className="image_wrapper">
              {customer?.image?.url ? (
                <img
                  src={customer?.image?.url}
                  alt={customer?.image?.alt}
                  className="w-[56px] h-[56px] object-contain flex justify-center items-center aspect-square"
                  width={customer?.image?.width}
                  height={customer?.image?.height}
                  loading="eager"
                />
              ) : (
                <NoProfileImageIcon />
              )}
            </div>
            <div className="text_content">
              {customer?.email !== undefined ? (
                <p className="name_with_email font-Univers-Regular text-[12.8px]">{`${customer?.firstName?.split(' ')?.[0]} ${customer?.firstName?.split(' ')?.[1] !== undefined ? customer?.firstName?.split(' ')?.[1]?.split('')?.[0] : customer?.lastName?.split(' ')?.[0]?.split('')?.[0]} (${customer?.email})`}</p>
              ) : (
                <p className="name_with_email font-Univers-Regular text-[12.8px]">{`User N (user@lazertechnologies.com)`}</p>
              )}
              <AppProxyLink
                className="font-Univers-Regular text-[12.8px]"
                href="/account/logout/"
              >
                Log Out
              </AppProxyLink>
            </div>
          </div>
        ) : (
          <div className="email max-w-full w-full flex flex-row justify-start items-center max-h-[42px] mdl:max-h-[52px]">
            <input
              className="text-[#333333] h-[42px] font-Univers-Light text-sm mdl:text-base cursor-text mdl:h-[52px] w-full border border-[#D9D9D9] rounded-[5px]"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              autoComplete="customer email"
              onChange={handleInputChange}
              value={email}
              onBlur={getCustomerByEmail}
            />
          </div>
        )}
        <div className="relative flex flex-row justify-start items-center gap-2">
          <div className="checkbox_wrapper">
            <Checkbox
              label="Email me with news and offers"
              aria-label="Accepts Marketing"
              checked={acceptsMarketing}
              onChange={(e, val) => {
                setAcceptsMarketing(val);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
