import React, {useContext, useEffect, useState} from 'react';
import {CheckoutContext} from '~/Context';
import {getCurrencySymbol} from '~/lib/utils';

export function FormSubmit() {
  const {
    verifiedShippingAddress,
    verifiedBillingAddress,
    verifiedCardInfo,
    draftOrder,
    selectedShippingMethod,
    customer,
    purchaseOrderNumber,
    appUrl,
  } = useContext(CheckoutContext);

  const sendEmail = async (reqData) => {
    try {
      const response = await fetch(
        `${appUrl?.endsWith('.com/') ? `${appUrl}api/send-email` : `${appUrl}/api/send-email`}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reqData,
          }),
        },
      );
      const data = (await response.json()) || {};

      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const createOrder = async (reqData) => {
    try {
      const response = await fetch(
        `${appUrl?.endsWith('.com/') ? `${appUrl}api/create-order` : `${appUrl}/api/create-order`}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reqData,
          }),
        },
      );
      const data = (await response.json()) || {};

      if (data?.data?.order) {
        const response = await sendEmail({
          orderNumber: data?.data?.order,
          purchaseOrderNumber,
        });
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderSubmit = async () => {
    try {
      if (!draftOrder) {
        throw {message: 'Please submit the draft order'};
      }

      if (!verifiedShippingAddress) {
        throw {message: 'Please provide a verified shipping address'};
      }

      if (!verifiedBillingAddress) {
        throw {message: 'Please provide a verified billing address'};
      }

      if (!selectedShippingMethod) {
        throw {message: 'Please select a shipping method'};
      }

      if (!customer) {
        throw {message: 'Please provide customer information'};
      }

      if (!purchaseOrderNumber) {
        throw {message: 'Purchase order number should be provided'};
      }

      if (!verifiedCardInfo) {
        throw {message: 'Please provide verified card information'};
      }

      const lineItems = draftOrder.lineItems?.nodes?.map((line_item) => {
        const item = {
          variantID: line_item.variant.id.match(/\d+$/)[0],
          productTitle: line_item.title,
        };

        // if (line_item.properties !== empty) {
        //   item.properties = {};
        //   line_item.properties.forEach((property) => {
        //     item.properties[JSON.stringify(property.first)] = JSON.stringify(
        //       property.last,
        //     );
        //   });
        // } else {
        item.price = line_item.originalUnitPrice;
        item.quantity = line_item.quantity;
        // }

        return item;
      });

      const shippingAddress = {
        address1: verifiedShippingAddress.address1,
        address2: verifiedShippingAddress.address2,
        city: verifiedShippingAddress.city,
        province: verifiedShippingAddress.provinceCode,
        zip: verifiedShippingAddress.zip,
        company: verifiedShippingAddress.company,
        country: verifiedShippingAddress.country,
        country_code: verifiedShippingAddress.countryCodeV2,
        first_name: verifiedShippingAddress.firstName,
        last_name: verifiedShippingAddress.lastName,
        name: `${verifiedShippingAddress.firstName} ${verifiedShippingAddress.lastName}`,
        phone: verifiedShippingAddress.phone,
        email: customer.email,
      };
      const billingAddress = {
        address1: verifiedBillingAddress.address1,
        address2: verifiedBillingAddress.address2,
        city: verifiedBillingAddress.city,
        province: verifiedBillingAddress.provinceCode,
        zip: verifiedBillingAddress.zip,
        company: verifiedBillingAddress.company,
        country: verifiedBillingAddress.country,
        country_code: verifiedBillingAddress.countryCodeV2,
        first_name: verifiedBillingAddress.firstName,
        last_name: verifiedBillingAddress.lastName,
        name: `${verifiedBillingAddress.firstName} ${verifiedBillingAddress.lastName}`,
        phone: verifiedBillingAddress.phone,
        email: customer.email,
      };

      const shippingMethod = {
        shippingTitle: selectedShippingMethod.title,
        shippingPrice: `$${selectedShippingMethod.price.amount}`,
        shippingHandle: selectedShippingMethod.handle,
        taxPrice: draftOrder.totalTax,
        taxPercentage: null, //TODO
      };
      const payment_method = {
        credit_card_no: verifiedCardInfo.cardNumber,
        name: verifiedCardInfo.cardName,
        expiry: verifiedCardInfo.expirationDate,
        verification_value: verifiedCardInfo.cardCode,
      };
      const taxRates = draftOrder.taxLines?.map((tax_line) => ({
        taxTitle: tax_line.title,
        taxPercentage: tax_line.rate_percentage,
      }));
      const misc = {
        purchaseOrderNo: purchaseOrderNumber,
        stockNotification: 'shipComplete',
        notes: '',
        tax_exempt: draftOrder.taxExempt,
        orderID: draftOrder.id.match(/\d+$/)[0],
        // freightCollect: false,
        // twilioMessage: false,
        // twilioPhone: '',
      };
      const reqData = {
        lineItems,
        shippingMethod,
        shippingAddress,
        billingAddress,
        payment_method,
        taxRates,
        misc,
      };
      const data = await createOrder(reqData);
    } catch (error) {
      console.log('ERROR', error.message);
    }
  };

  return (
    <div className="w-11/12 sm:w-10/12 md:w-full m-auto text-end">
      <button
        className="px-4 py-3 bg-black hover:bg-white hover:text-black text-white font-Eurostile-Next-Bold text-md md:text-xl font-bold rounded-md border border-black transition duration-150 ease-in-out"
        type="submit"
        onClick={handleOrderSubmit}
      >
        SUBMIT ORDER
      </button>
    </div>
  );
}
