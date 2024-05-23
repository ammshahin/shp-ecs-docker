import {json} from '@remix-run/node';
import {ADDRESS_PREDICTION_QUERY} from '~/Shopify';

export async function action({request}) {
  try {
    const body = await request.json();

    const {query, countryCode, sessionToken} = body || {};

    const response = await fetch('https://atlas.shopifysvc.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://checkout.shopify.com',
      },
      body: JSON.stringify({
        query: ADDRESS_PREDICTION_QUERY,
        variables: {
          query,
          countryCode,
          sessionToken,
          locale: 'en-US',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error fetching from API: ${
          response.statusText
        }. Server response: ${JSON.stringify(errorText, null, 2)}`,
      );
    }

    const responseData = await response.json();

    if (responseData.errors && responseData.errors.length > 0) {
      throw new Error(`GraphQL errors: ${JSON.stringify(responseData.errors)}`);
    }

    const {
      data: {predictions},
    } = responseData || {};

    return json({predictions});
  } catch (err) {
    return json({
      success: false,
      error: err?.message || 'Something went wrong',
    });
  }
}
