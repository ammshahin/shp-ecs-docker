export const METAFIELD_FRAGMENT = `#graphql
  fragment Metafields on Metafields {
    id
    key
    namespace
    value
    createdAt
    updatedAt
  }
`;

export const SHOP_FRAGMENT = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    customerAccountsV2 {
      loginRequiredAtCheckout
    }
  }
`;

export const METAFIELD_DEFINITION_FRAGMENT = `#graphql
  fragment MetafieldDefinition on MetafieldDefinition {
    id
    name
    namespace
    key
    visibleToStorefrontApi
  }
`;

export const MONEY_FRAGMENT = `#graphql
    fragment Money on MoneyV2 {
    currencyCode
    amount
  }
`;

export const ADDRESS_FRAGMENT = `#graphql
  fragment Address on MailingAddress {
    id
    formatted
    firstName
    name
    lastName
    company
    address1
    address2
    country
    countryCodeV2
    province
    provinceCode
    city
    zip
    phone
  }
`;

export const CUSTOMER_FRAGMENT = `#graphql ${ADDRESS_FRAGMENT}
  fragment Customer on Customer {
    emailMarketingConsent {
      marketingState
    }
    addresses {
        ...Address
    }
    defaultAddress {
      ...Address
    }
    email
    id
    firstName
    lastName
    image {
      url
      id
      altText
      height
      width
    }
    numberOfOrders
    phone
    tags
    metafields(first:10){
      nodes{
        value
        namespace
      }
    }
  }
`;

export const CUSTOMER_QUERY_FRAGMENT = `#graphql
  fragment Customer on Customer {
    email
    id
    firstName
    lastName
    numberOfOrders
    phone
    tags
  }
`;

export const DRAFT_ORDER_QUERY_FRAGMENT = `#graphql ${ADDRESS_FRAGMENT}
  fragment DraftOrderFragment on DraftOrder {
    id
    currencyCode
    invoiceSentAt
    invoiceUrl
    status
    taxExempt
    currencyCode
    lineItems(first:50) {
      nodes {
        customAttributes {
          key
          value
        }
        id
        image {
          url
          altText
          height
          id
          width
        }
        originalUnitPrice
        discountedUnitPrice
        sku
        title
        product {
          id
        }
        variant {
          id
          availableForSale
          title
          selectedOptions {
            name
            value
          }
        }
        quantity
      }
    }
    shippingAddress {
      ...Address
    }
    billingAddress {
      ...Address
    }
    appliedDiscount {
      title
      description
      amountV2 {
        currencyCode
        amount
      }
      valueType
      value
    }
    taxLines {
      rate
      title
    }
    paymentTerms {
      paymentTermsName
    }
    shippingLine {
      carrierIdentifier
      code
    }
    order {
      id
    }
    subtotalPrice
    totalPrice
    totalShippingPrice
    totalTax
    totalWeight
  }
`;
export const CART_QUERY_FRAGMENT = `#graphql ${CUSTOMER_QUERY_FRAGMENT} ${MONEY_FRAGMENT}
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    discountAllocations {
      discountedAmount {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        sku
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          vendor
          title
          id
          productType
          collections(first:50) {
            nodes {
              id
            }
          }
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartQuery on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        ...Customer
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    discountAllocations {
      discountedAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
`;
export const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment GrandChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
    items {
      ...GrandChildMenuItem
    }
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    handle
    title
    itemsCount
    id
    items {
      ...ParentMenuItem
    }
  }
`;
