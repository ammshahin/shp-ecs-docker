import {json} from '@remix-run/node';

export async function action({request}) {
  try {
    const body = await request.json();

    const {aimsId} = body || {};
    const formData = new FormData();
    formData.append('customer_account', aimsId);

    const response = await fetch(
      'https://abc.laapparel.info/aims/get_aims_credit_cards_by_email',
      {
        method: 'POST',
        body: formData,
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Cards not found');
        }
        return response.json();
      })
      .catch((e) => {
        throw e;
      });

    return json(response);
  } catch (err) {
    return json({
      success: false,
      error: err,
      message: 'Something went wrong',
    });
  }
}
