import {
  CART_QUERY_FRAGMENT,
  CUSTOMER_FRAGMENT,
  CUSTOMER_QUERY_FRAGMENT,
  DRAFT_ORDER_QUERY_FRAGMENT,
  MENU_FRAGMENT,
  METAFIELD_DEFINITION_FRAGMENT,
  SHOP_FRAGMENT,
} from './shopify.fragment';

export const SHOP_QUERY = `#graphql ${SHOP_FRAGMENT}
  query shop {
    shop {
      ...Shop
    }
  }`;

export const DISCOUNT_QUERY = `#graphql
  query GetDiscount($id: ID!, $keys: [String!], $first: Int!) {
    discountNode(id: $id) {
      id
    metafields(keys: $keys, first: $first) {
        nodes {
          id
          value
        }
      }
    discount {
      __typename
      ... on DiscountAutomaticApp {
        title
        discountClass
        combinesWith {
          orderDiscounts
          productDiscounts
          shippingDiscounts
        }
        startsAt
        endsAt
      }
    }
    }
  }`;

export const APP_QUERY = `#graphql
  query ($apiKey: String!) {
    appByKey (apiKey: $apiKey) {
      id
    }
  }`;

export const SHOP_METAFIELD_QUERY = `#graphql ${METAFIELD_DEFINITION_FRAGMENT}
  query MetafieldDefinitions ($first: Int!, $ownerType: MetafieldOwnerType!) {
    metafieldDefinitions(first: $first, ownerType: $ownerType) {
      nodes {
        ...MetafieldDefinition
      }
    }
  }`;

export const DRAFT_ORDER_QUERY = `#graphql ${DRAFT_ORDER_QUERY_FRAGMENT}
  query DraftOrder ($first: Int!, $query: String!, $reverse: Boolean!, $sortKey: DraftOrderSortKeys!) {
  draftOrders(first: $first, query: $query, reverse: $reverse, sortKey: $sortKey) {
    nodes {
      ...DraftOrderFragment
    }
  }
}`;

/**
 * Description
 * @param {any} $id:ID!$numCartLines:Int!
 * @returns {any}
 */
export const CART_QUERY = `#graphql ${CART_QUERY_FRAGMENT}
  query cart(
    $id: ID!
    $numCartLines: Int!
  ) {
    cart(id: $id) {
      ...CartQuery
    }
  }
`;
export const CUSTOMER_QUERY = `#graphql ${CUSTOMER_FRAGMENT}
  query customer(
    $id: ID!
  ) {
    customer(id: $id) {
      ...Customer
    }
  }
`;
/**
 * Description
 * @param {any} $headerMenuHandle:String!$first:Int!
 * @returns {any}
 */
export const MENUS_QUERY = `#graphql ${MENU_FRAGMENT}
  query menus(
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) {
    headerMenu: menu(handle: $headerMenuHandle) {
      title
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      title
      ...Menu
    }
  }

`;

/**
 * Description
 * @param {String} query
 * @param {AutocompleteSupportedCountry} countryCode
 * @param {String} locale
 * @param {String} sessionToken
 * @returns {Object}
 */
export const ADDRESS_PREDICTION_QUERY = `#graphql
  query predictions($query: String, $countryCode: AutocompleteSupportedCountry!, $locale: String!, $sessionToken: String!) {
    predictions(query: $query, countryCode: $countryCode, locale: $locale, sessionToken: $sessionToken) {
      addressId
      description
      completionService
      matchedSubstrings {
        length
        offset
      }
    }
  }
`;
/**
 * This query is used to fetch detailed information about a specific address.
 *
 * @param {String} addressId - The unique identifier of the address.
 * @param {String} locale - The locale for the address information.
 * @param {String} sessionToken - The session token for the address.
 *
 * @returns {Object} - An object containing detailed information about the address.
 *
 * @property {String} address1 - The first line of the address.
 * @property {String} address2 - The second line of the address.
 * @property {String} city - The city of the address.
 * @property {String} country - The country of the address.
 * @property {String} countryCode - The country code of the address.
 * @property {String} province - The province of the address.
 * @property {String} provinceCode - The province code of the address.
 * @property {String} zip - The zip code of the address.
 * @property {Number} latitude - The latitude of the address.
 * @property {Number} longitude - The longitude of the address.
 *
 * @example
 * const addressId = 'gid://shopify/Address/1234567890';
 * const locale = 'en-US';
 * const sessionToken = 'abc123';
 * const adapterOverride = 'customAdapter';
 *
 * const addressData = await fetchAddress(addressId, locale, sessionToken, adapterOverride);
 * console.log(addressData);
 * // Output:
 * // {
 * //   address1: '123 Main St',
 * //   address2: '',
 * //   city: 'Anytown',
 * //   country: 'United States',
 * //   countryCode: 'US',
 * //   province: 'California',
 * //   provinceCode: 'CA',
 * //   zip: '12345',
 * //   latitude: 37.7749,
 * //   longitude: -122.4194
 * // }
 */
export const ADDRESS_QUERY = `#graphql
  query address($addressId: String!, $locale: String!, $sessionToken: String!) {
    address(id: $addressId, locale: $locale, sessionToken: $sessionToken) {
      address1
      address2
      city
      country
      countryCode
      province
      provinceCode
      zip
      latitude
      longitude
    }
  }
`;

export const GET_CUSTOMER_BY_EMAIL = `#graphql ${CUSTOMER_FRAGMENT}
  query getCustomerByEmail($query: String!){
  customers(first: 1, query: $query) {
      nodes {
        ...Customer
      }
  }
}`;

export const ADDRESS_VALIDATION_QUERY = `#graphql
  query validation($address: AddressInput!, $locale: String!, $matchingStrategy: MatchingStrategy) {
    validation(address: $address, locale: $locale, matchingStrategy: $matchingStrategy) {
      validationScope
      locale
      fields {
        name
        value
      }
      concerns {
        fieldNames
        code
        type
        typeLevel
        suggestionIds
        message
      }
      id
      suggestions {
        id
        address1
        address2
        city
        zip
        provinceCode
        province
        countryCode
      }
    }
  }
`;
