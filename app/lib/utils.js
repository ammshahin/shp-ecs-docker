import {clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getCartId(request) {
  const search = new URL(request.url).search;
  const searchParams = new URLSearchParams(search);
  return searchParams.get('cart')
    ? `gid://shopify/Cart/${searchParams.get('cart')}`
    : undefined;
}

export function getCartIdFromCookie(data) {
  const cookies = data?.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'cart') {
      return `gid://shopify/Cart/${value}`;
    }
  }
  return null;
}

export const getCardExpiry = (input) => {
  const [month, year] = input.split(' / ');
  return `${year}-${month.padStart(2, '0')}`;
};

export const getCardNumber = (input) => {
  return input.replace(/\D/g, '');
};

export function getCheckoutSessionToken(cartId, shopId) {
  const cartToken = cartId?.replace('gid://shopify/Cart/', '');
  const shopToken = shopId?.replace('gid://shopify/Shop/', '');
  const secureToken = `${cartToken}-${shopToken}`;
  return secureToken;
}

export function getDateTimeNow() {
  // Create a new Date object
  var date = new Date();

  // Get the current date and time in UTC
  var year = date.getUTCFullYear();
  var month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  var day = String(date.getUTCDate()).padStart(2, '0');
  var hours = String(date.getUTCHours()).padStart(2, '0');
  var minutes = String(date.getUTCMinutes()).padStart(2, '0');
  var seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Create the formatted date string
  var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

  return formattedDate; // Output: 2024-05-09T12:00:00Z (for example)
}

export const getCurrencySymbol = (locale, currency) => {
  (0)
    .toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();
};

export const generateTemplate = ({orderNumber, purchaseOrderNumber}) => {
  const date = new Date();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthName = months[date.getMonth()];
  const datestring = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;

  const orderSummaryHtml = `<span style="text-align: left; font-weight: 600;">ORDER NO. ${orderNumber} <br />PO: ${purchaseOrderNumber} </span><h2 style="text-align: left;margin: 20px 0 5px;text-transform: uppercase;font-weight: 600;">Order Summary</h2>${"orderSummary.outerHTML"}`;

  const footerSummaryHtml = `<table class="order_summary" style="margin: 10px 0 20px; padding:0;" cellpadding="0" cellspacing="0">${"shippingSummary"}</table><h2 style="margin: 30px 0 3px;text-transform: uppercase;font-weight: 600;">Customer Details</h2><span>Company Name: ${"companyName"}</span><br>${"customInfoString.innerHTML"}<table style="margin: 5px 0px; padding:0;" cellpadding="0" cellspacing="0"><tr><td>Payment Type: ${'Credit Card'} <br />Order Date: ${datestring}</td></tr></table>`;

  return {
    template_name: 'laa-wholesale-order-confirmation',
    template_content: [
      {
        name: 'header',
        content:
          '<h2 style="font-size: 13px;margin: 0px 0 20px;text-transform: uppercase;font-weight: 600;">Thank you for your purchase!</h2>',
      },
      {
        name: 'main',
        content: orderSummaryHtml,
      },
      {
        name: 'footer',
        content: footerSummaryHtml,
      },
    ],
    message: {
      from_email: 'wholesale-order@losangelesapparel.net',
      to: [
        {
          email: "meherullah.shahin@bevycommerce.com",
          name: 'Los Angeles Apparel Wholesale Order Confirmation',
        },
        // {
        //   email: 'customerservice@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
        // {
        //   email: 'pat@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
        // {
        //   email: 'wholesale-order@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
        // {
        //   email: 'lance@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
        // {
        //   email: 'edisson@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
        // {
        //   email: 'steve@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
        // {
        //   email: 'jeffrey@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
        // {
        //   email: 'moses@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
        // {
        //   email: 'dominic@losangelesapparel.net',
        //   name: 'Los Angeles Apparel Wholesale Order Confirmation',
        // },
      ],
      subject: `Los Angeles Apparel Wholesale Order Confirmation - ${orderNumber}`,
    },
  };
};
