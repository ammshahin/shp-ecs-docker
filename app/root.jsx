import {json} from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import tailwindCss from './Styles/tailwind.css?url';
import favicon from './Styles/favicon-32x32.png?url';
export const loader = async ({request}) => {
  return json({appUrl: process.env.SHOPIFY_APP_URL});
};
export default function App() {
  const {appUrl} = useLoaderData();

  return (
    <html className="scroll-smooth" lang="en-US" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link rel="stylesheet" href={`${appUrl + tailwindCss}`} />
        <link rel="icon" type="image/png" href={`${appUrl + favicon}`} />
        <Meta />
        <Links />
      </head>
      <body className="relative min-h-screen flex flex-col">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
