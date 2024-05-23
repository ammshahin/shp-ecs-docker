import {json} from '@remix-run/node';
import {useLoaderData, Links} from '@remix-run/react';
import {AppProxyProvider} from '@shopify/shopify-app-remix/react';
import {authenticate} from '~/shopify.server';
import {Header, Body, Layout, Section, Footer} from '../Components/Common';
import {
  CUSTOMER_QUERY,
  DRAFT_ORDER_QUERY,
  MENUS_QUERY,
  SHOP_QUERY,
} from '~/Shopify';
import {getCartIdFromCookie, getCheckoutSessionToken} from '../lib/utils.js';
import {
  ContactBlock,
  PurchaseBlock,
  ShippingBlock,
  PaymentBlock,
  CartSummaryBlock,
  FormSubmit,
  ShippingAddressBlock,
} from '~/Components/Checkout';
import {CheckoutContextProvider} from '~/Context';

export async function loader({request}) {
  const {storefront, admin} = await authenticate.public.appProxy(request);
  let customerData, draftOrderData;
  const envs = process.env;
  const appUrl = envs.SHOPIFY_APP_URL;
  const authorizeVars = {
    authorizeUrl: envs.AUTHORIZE_NET_API_URL,
    authorizeApiId: envs.AUTHORIZE_NET_API_ID,
    authorizeApiKey: envs.AUTHORIZE_NET_API_KEY,
  };
  const environment = envs.NODE_ENV;
  const params = new URL(request.url).searchParams;
  const loggedInCustomerId = params.get('logged_in_customer_id');
  const loggedInCustomerAdminId = `gid://shopify/Customer/${loggedInCustomerId}`;

  try {
    if (!storefront) {
      return json({
        appUrl,
        authorizeVars,
        environment,
        message: 'Storefront is undefined',
      });
    }

    const shopResponse = await admin.graphql(SHOP_QUERY);
    const shopData = await shopResponse.json();

    const menusResponse = await storefront.graphql(MENUS_QUERY, {
      variables: {
        headerMenuHandle: 'main-menu',
        footerMenuHandle: 'footer',
      },
    });

    const menusData = await menusResponse.json();

    if (loggedInCustomerId !== '') {
      const draftOrderResponse = await admin.graphql(DRAFT_ORDER_QUERY, {
        variables: {
          first: 1,
          reverse: true,
          sortKey: 'UPDATED_AT',
          query: `customer_id:${loggedInCustomerId}`,
        },
      });
      draftOrderData = await draftOrderResponse.json();

      const customerResponse = await admin.graphql(CUSTOMER_QUERY, {
        variables: {
          id: loggedInCustomerAdminId,
        },
      });

      customerData = await customerResponse.json();
    }

    return json({
      appUrl,
      authorizeVars,
      environment,
      customerLoggedIn: loggedInCustomerId ? true : false,
      shop: shopData?.data?.shop || {},
      headerMenu: menusData?.data?.headerMenu || {},
      footerMenu: menusData?.data?.footerMenu || {},
      customerData: customerData?.data?.customer || {},
      draftOrderData: draftOrderData?.data?.draftOrders?.nodes[0] || {},
    });
  } catch (error) {
    console.log('⇐-------------↓↓↓ error ↓↓↓-------------⇒');
    console.log(error);
    console.log('⇐-------------↑↑↑ error ↑↑↑-------------⇒');
    return json({
      appUrl,
      authorizeVars,
      environment,
      message: 'An error occurred while processing the request.',
      error: error.message,
    });
  }
}

export async function clientLoader({serverLoader}) {
  const data = document.cookie;
  const cartId = getCartIdFromCookie(data);
  const loaderData = await serverLoader();
  const {shop} = loaderData || {};
  const checkoutSessionToken =
    cartId && shop ? getCheckoutSessionToken(cartId, shop?.id) : null;

  return {checkoutSessionToken, ...loaderData};
}
clientLoader.hydrate = true;
export default function App() {
  const loaderData = useLoaderData();
  const {appUrl, headerMenu, footerMenu, authorizeVars} = loaderData || {};

  return (
    <AppProxyProvider appUrl={appUrl}>
      <CheckoutContextProvider {...loaderData}>
        <Body className="max-w-screen min-h-screen w-full h-full flex flex-col justify-between items-center overflow-x-hidden">
          <Header menu={headerMenu} />
          <Layout className="w-full p-0 mt-0 mb-8 mdl:my-16 box-border flex flex-col-reverse flex-[1_0_auto] mdl:max-w-[910px] mdl:px-[50px] xlg:px-0 xlg:max-w-[1172px] mdl:flex-row mdl:justify-between mdl:items-start">
            <Section className="box-border max-w-[486px] mx-auto relative p-0 px-[12.8px] mt-8 flex flex-col justify-start items-start gap-[1.5em] mdl:gap-[3em] mdl:max-w-[500px] mdl:pr-[50px] xlg:pr-0 xlg:max-w-[668px] mdl:w-full flex-[1_0_auto]">
              <ContactBlock />
              <PurchaseBlock />
              <ShippingAddressBlock />
              <ShippingBlock />
              <PaymentBlock authorizeVars={authorizeVars} />
              <FormSubmit />
            </Section>
            <Section className="relative text-[#535353] p-0 flex flex-col justify-start items-start box-border will-change-[min-height] mdl:max-w-[400px] mdl:w-full">
              <CartSummaryBlock
                className="max-w-[486px] w-full"
                blockClasses="w-full"
              />
            </Section>
          </Layout>
          <Footer menu={footerMenu} />
        </Body>
      </CheckoutContextProvider>
    </AppProxyProvider>
  );
}
// USING THIS ACTION AS GQL QUERY AND MUTATION CLIENT
export async function action({request}) {
  const [formData] = await Promise.all([request.formData()]);
  const body = JSON.parse(formData.get('body'));

  const {query, options, client} = body || {};
  console.log('⇐-------------↓↓↓ options ↓↓↓-------------⇒');
  console.log(JSON.stringify(options, null, 2));
  console.log('⇐-------------↑↑↑ options ↑↑↑-------------⇒');

  const {admin, storefront} = await authenticate.public.appProxy(request);
  try {
    let response;
    if (client === 'storefront') {
      response = await storefront.graphql(query, options);
    } else {
      response = await admin.graphql(query, options);
    }
    const {data} = (await response.json()) || {};

    console.log('⇐-------------↓↓↓ response from action ↓↓↓-------------⇒');
    console.log(JSON.stringify(data, null, 2));
    console.log('⇐-------------↑↑↑ response from action ↑↑↑-------------⇒');

    return json({status: 200, data});
  } catch (error) {
    console.log('⇐-------------↓↓↓ error from action ↓↓↓-------------⇒');
    console.log(error);
    console.log('⇐-------------↑↑↑ error from action ↑↑↑-------------⇒');

    return json({error, status: 500, message: 'Internal Server Error'});
  }
}
