export const authorizeCard = async ({cardInfo, authorizeVars}) => {
  const body = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: authorizeVars.authorizeApiId,
        transactionKey: authorizeVars.authorizeApiKey,
      },
      refId: '',
      transactionRequest: {
        transactionType: 'authOnlyTransaction',
        amount: '1.00',
        currencyCode: 'USD',
        payment: {
          creditCard: cardInfo,
        },
        customer: {
          id: '',
        },
      },
    },
  };
  try {
    const response = await fetch(
      authorizeVars.authorizeUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};

export const areCardInfosEqual = (cardInfo1, cardInfo2) => {
  if (!cardInfo1 || !cardInfo2) {
    return false;
  }

  if (
    cardInfo1.cardNumber !== cardInfo2.cardNumber ||
    cardInfo1.expirationDate !== cardInfo2.expirationDate ||
    cardInfo1.cardCode !== cardInfo2.cardCode
  ) {
    return false;
  }

  return true;
};
