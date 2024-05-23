import {json} from '@remix-run/node';

export async function action({request}) {
  try {
    const body = await request.json();

    const {reqData} = body || {};
    console.log('🚀 ~ action ~ reqData:', reqData);
    return null;

    const response = await fetch(
      'https://aims-gtn.com/main/laa/shopify/create_order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'https://checkout.shopify.com',
        },
        body: JSON.stringify({
          wholesale_order: reqData,
        }),
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Order not created');
        }
        return response.json();
      })
      .catch((e) => {
        throw e;
      });

    return json(response.data);
  } catch (err) {
    return json({
      success: false,
      error: err,
      message: 'Something went wrong',
    });
  }
}
