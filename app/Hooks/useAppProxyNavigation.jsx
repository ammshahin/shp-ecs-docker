import {useContext} from 'react';
import {AppProxyProviderContext} from '@shopify/shopify-app-remix/react';

/**
 * Custom hook to navigate to proxied routes within an app proxy environment.
 *
 * @returns {Function} A function to navigate to the specified proxied route.
 */
function useAppProxyNavigation() {
  const context = useContext(AppProxyProviderContext);

  if (!context) {
    throw new Error(
      'useAppProxyNavigation must be used within an AppProxyProvider component',
    );
  }

  /**
   * Navigate to the specified proxied route.
   *
   * @param {string} href - The path of the proxied route.
   */
  function navigateTo(href) {
    const formattedUrl = context.formatUrl(href);
    window.location.href = formattedUrl;
  }

  return navigateTo;
}

export {useAppProxyNavigation};
