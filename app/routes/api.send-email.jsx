import {json} from '@remix-run/node';
import {generateTemplate} from '~/lib/utils';
import mailchimp from '@mailchimp/mailchimp_transactional';

export async function action({request}) {
  try {
    const body = await request.json();
    const mandrillApiKey = process.env.MANDRILL_API_KEY;

    const {reqData} = body || {};

    const {orderNumber, purchaseOrderNumber} = reqData;
    const params = generateTemplate({orderNumber, purchaseOrderNumber});

    const response =
      await mailchimp(mandrillApiKey).messages.sendTemplate(params);
    if (response.length) {
      return json({status: 200, response, message: 'Email send successfully'});
    }

    if (response?.response) {
      return json({
        status: response?.response?.status,
        message: response?.response?.message,
      });
    }
    return null;
  } catch (error) {
    console.error('Error sending email:', error);
    return json({
      success: false,
      error: error,
      message: 'Something went wrong',
    });
  }
}
