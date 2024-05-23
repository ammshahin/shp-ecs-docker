import {useContext, useEffect, useState} from 'react';
import {z} from 'zod';
import {
  AmexIcon,
  CrossIcon,
  DiscoverIcon,
  JcbIcon,
  MastercardIcon,
  VisaIcon,
} from '../Common';
import ControlledInput from '../Common/ControlledInput';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormProvider, useForm} from 'react-hook-form';
import {getCardExpiry, getCardNumber} from '~/lib/utils';
import {areCardInfosEqual, authorizeCard} from '~/lib/authorize';
import {CheckoutContext} from '~/Context';
import {BillingAddressBlock} from '~/Components/Checkout';

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Enter a card number')
    .refine((value) => !isNaN(Number(value.replace(/\s/g, ''))), {
      message: 'Card Number must be a number',
    }),
  expiry: z
    .string()
    .min(1, 'Enter a valid expiration date')
    .refine(
      (value) => {
        const [month, year] = value.split(' / ');
        const currentYear = new Date().getFullYear();
        return (
          typeof value === 'string' &&
          !isNaN(Number(month)) &&
          Number(month) >= 1 &&
          Number(month) <= 12 &&
          Number(year) >= currentYear
        );
      },
      {
        message: 'Enter a valid expiration date',
      },
    ),
  securityCode: z
    .string()
    .min(3, 'Enter the CVV or security code on your card')
    .refine((value) => !isNaN(Number(value)), {
      message: 'Security Code must be a number',
    }),
  cardName: z.string().min(1, 'Enter the name written on your card'),
});

export function PaymentBlock({authorizeVars}) {
  const {
    verifiedCardInfo,
    setVerifiedCardInfo,
    cardVerificationResponse,
    setCardVerificationResponse,
    verifiedShippingAddress,
    setVerifiedBillingAddress,
    customer,
    appUrl,
  } = useContext(CheckoutContext);

  const [verifyError, setVerifyError] = useState('');
  const [shippingAsBilling, setShippingAsBilling] = useState(true);
  const [customerCards, setCustomerCards] = useState(null);

  const metafield = customer?.metafields?.nodes?.find(
    (metafield) => metafield.namespace === 'custom_fields',
  );

  useEffect(() => {
    setCardVerificationResponse(null);
    setVerifiedCardInfo(null);
  }, []);

  const getCustomerCardsByAims = async (aimsId) => {
    try {
      const response = await fetch(
        `${appUrl?.endsWith('.com/') ? `${appUrl}api/aims-credit-cards` : `${appUrl}/api/aims-credit-cards`}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aimsId,
          }),
        },
      );
      const data = response.json() || {};
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const getCustomerCards = async (aimsId) => {
      const cards = await getCustomerCardsByAims(aimsId);
      if (cards?.list_of_ccs) setCustomerCards(cards.list_of_ccs);
    };
    if (metafield?.value) {
      getCustomerCards(metafield?.value);
    }
  }, [metafield]);

  const useFormAttributes = useForm({
    mode: 'onBlur',
    resolver: zodResolver(paymentSchema),
  });

  const handleSubmit = async (values) => {
    const cardInfo = {
      cardNumber: getCardNumber(values.cardNumber),
      expirationDate: getCardExpiry(values.expiry),
      cardCode: values.securityCode,
    };

    const prevCardInfo = verifiedCardInfo;
    const duplicateCard = areCardInfosEqual(prevCardInfo, cardInfo);

    if (!cardVerificationResponse || !duplicateCard) {
      const verifyResponse = await authorizeCard({
        userInfo: {},
        cardInfo,
        authorizeVars,
      });
      if (!verifyResponse?.transactionResponse) {
        setVerifyError('Failed to verify card informations!');
      }
      if (verifyResponse?.transactionResponse) {
        const transaction = verifyResponse.transactionResponse;
        switch (transaction.responseCode) {
          case '3':
            setVerifyError(transaction.errors[0].errorText);
            setCardVerificationResponse(null);
            setVerifiedCardInfo(null);
            break;
          case '1':
            setVerifyError('');
            setCardVerificationResponse(JSON.stringify(transaction));
            setVerifiedCardInfo({cardName: values.cardName, ...cardInfo});
            break;
          default:
            setVerifyError('Card verification was unsuccessful.');
            break;
        }
      }
    }
  };

  useEffect(() => {
    if (shippingAsBilling) {
      setVerifiedBillingAddress(verifiedShippingAddress);
    } else {
      setVerifiedBillingAddress(null);
    }
  }, [setVerifiedBillingAddress, shippingAsBilling, verifiedShippingAddress]);

  return (
    <div className="w-full sm:w-10/12 md:w-full flex flex-col gap-2 m-auto">
      <div className="relative box-border mb-5 flex flex-col gap-2">
        <h2 className="font-Eurostile-Next-Bold text-black text-[20px] leading-normal tracking-[-0.4px] flex-[1_1_auto]">
          Payment
        </h2>
        <p className="text-sm font-light">
          All transactions are secure and encrypted.
        </p>
      </div>
      <div className="">
        <div className="bg-[#F8FBFE] border border-[#1773B0] flex justify-between p-3 rounded-t">
          <p className="text-sm text-[#707070]">Credit Card</p>
          <div className="flex gap-2">
            <VisaIcon />
            <MastercardIcon />
            <AmexIcon />
            <DiscoverIcon />

            <div className="bg-[#FFF] w-[38px] h-[24px] text-center rounded cursor-pointer has-tooltip">
              <span className="tooltip rounded-md -mt-6 -ml-2">
                <JcbIcon />
              </span>
              +1
            </div>
          </div>
        </div>
        {verifyError && (
          <div className="flex justify-between bg-[#f87171] p-4 mx-4 mt-4 rounded transition-all duration-700 ease-in-out">
            <p className="text-white">{verifyError}</p>
            <button
              className="cursor-pointer"
              onClick={() => setVerifyError('')}
            >
              <CrossIcon color="#FFFFFF" />
            </button>
          </div>
        )}
        <FormProvider {...useFormAttributes}>
          <form
            className="p-4 flex flex-col gap-3 bg-[#FAFAFA] rounded-b"
            onBlur={useFormAttributes.handleSubmit(handleSubmit)}
          >
            <ControlledInput
              placeholder={'Card Number'}
              label={'Card Number'}
              type="number"
              icon={'lock'}
              name={'cardNumber'}
            />
            <div className="grid md:grid-cols-2 gap-2">
              <ControlledInput
                placeholder={'Expiration date (MM/YYYY)'}
                label={'Expiration date (MM / YYYY)'}
                type="number"
                max="4"
                name={'expiry'}
              />
              <ControlledInput
                type="tel"
                max="4"
                placeholder={'Security code'}
                label={'Security code'}
                icon={'question'}
                name={'securityCode'}
              />
            </div>
            <ControlledInput
              placeholder={'Name on card'}
              label={'Name on card'}
              icon={'cross'}
              name={'cardName'}
            />
            <div className="flex items-center gap-2">
              <input
                className="custom-input border-none rounded cursor-pointer"
                type="checkbox"
                checked={shippingAsBilling}
                onChange={() => setShippingAsBilling(!shippingAsBilling)}
              />
              <p className="text-sm">Use shipping address as billing address</p>
            </div>
          </form>
        </FormProvider>
        {!shippingAsBilling && <BillingAddressBlock />}
      </div>
    </div>
  );
}
