import {createContext, useEffect, useState} from 'react';
import {useAppProxyNavigation, useViewport} from '~/Hooks';

const CheckoutContext = createContext([]);

const CheckoutContextProvider = ({
  shop = {},
  draftOrderData = {},
  customerData = {},
  checkoutSessionToken = '',
  appUrl = '',
  customerLoggedIn,
  children,
  ...props
}) => {
  const navigateTo = useAppProxyNavigation();
  const viewport = useViewport();
  const defaultAddressObject = {
    id: '',
    formatted: [],
    firstName: '',
    name: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    country: '',
    countryCodeV2: '',
    province: '',
    provinceCode: '',
    city: '',
    zip: '',
    phone: '',
  };
  const [isDesktop, setIsDesktop] = useState(viewport > 990);
  const [customer, setCustomer] = useState(customerData);
  const [verifiedCardInfo, setVerifiedCardInfo] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(
    customer?.defaultAddress ?? defaultAddressObject,
  );
  const [billingAddress, setBillingAddress] = useState(
    customer?.defaultAddress ?? defaultAddressObject,
  );
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
  const [draftOrder, setDraftOrder] = useState(draftOrderData);
  const [lineItems, setLineItems] = useState(draftOrder?.lineItems?.nodes);
  const [verifiedShippingAddress, setVerifiedShippingAddress] = useState(null);
  const [verifiedBillingAddress, setVerifiedBillingAddress] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [cardVerificationResponse, setCardVerificationResponse] =
    useState(null);

  useEffect(() => {
    if (
      !customerLoggedIn &&
      shop?.customerAccountsV2?.loginRequiredAtCheckout
    ) {
      navigateTo(
        `${shop?.primaryDomain?.url}/account/login?return_url=/a/checkout/`,
      );
    }
    const handleResize = () => {
      setIsDesktop(viewport > 990);
    };
    handleResize();
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDesktop, viewport, setIsDesktop]);

  return (
    <CheckoutContext.Provider
      value={{
        shop,
        customerLoggedIn,
        draftOrder,
        setDraftOrder,
        lineItems,
        setLineItems,
        appUrl,
        customer,
        setCustomer,
        viewport,
        isDesktop,
        verifiedCardInfo,
        setVerifiedCardInfo,
        cardVerificationResponse,
        setCardVerificationResponse,
        shippingAddress,
        setShippingAddress,
        billingAddress,
        setBillingAddress,
        checkoutSessionToken,
        verifiedShippingAddress,
        setVerifiedShippingAddress,
        verifiedBillingAddress,
        setVerifiedBillingAddress,
        selectedShippingMethod,
        setSelectedShippingMethod,
        purchaseOrderNumber,
        setPurchaseOrderNumber,
        ...props,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export {CheckoutContextProvider, CheckoutContext};
