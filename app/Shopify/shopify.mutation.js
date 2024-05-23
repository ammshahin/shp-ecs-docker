import {CUSTOMER_FRAGMENT} from '~/Shopify';

export const DRAFT_ORDER_CALCULATE_MUTATION = `#graphql
  mutation draftOrderCalculate($input: DraftOrderInput!) {
    draftOrderCalculate(input: $input) {
      calculatedDraftOrder {
        totalPrice
        totalShippingPrice
        totalTax
        availableShippingRates {
          handle
          title
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }`;

export const CUSTOMER_MARKETING_CONSENT_UPDATE = `#graphql ${CUSTOMER_FRAGMENT}
  mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
  customerEmailMarketingConsentUpdate(input: $input) {
    customer {
      ...Customer
    }
    userErrors {
      field
      message
    }
  }
}
`;
