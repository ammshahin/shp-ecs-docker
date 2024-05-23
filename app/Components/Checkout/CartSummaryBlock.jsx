import {useContext, useEffect, useMemo, useState} from 'react';
import {CheckoutContext} from '~/Context';
import {
  CaretIcon,
  DiscountTagIcon,
  SavingsTagIcon,
  ShopifyCartIcon,
} from '~/Components/Common';

export function CartSummaryBlock({blockClasses = '', className = ''}) {
  const {draftOrder, isDesktop} = useContext(CheckoutContext);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  return (
    <aside
      className={`flex flex-col justify-start items-start ${blockClasses}`}
    >
      {!isDesktop && (
        <CartSummaryMobileTrigger
          isSummaryVisible={isSummaryVisible}
          setIsSummaryVisible={setIsSummaryVisible}
          className="mdl:hidden w-full"
        >
          <div className="cursor-pointer bg-[#FAFAFA] border border-y-[#E6E6E6] border-x-0 sm:border-t-0 py-[1.25em] px-[12.8px] text-left w-full font-bold">
            <div className="w-full box-border block mx-auto my-0 max-w-[486px]">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row justify-start items-center gap-2">
                  <ShopifyCartIcon className="hover:fill-[#323232]" />
                  <span className="flex flex-row justify-start items-center gap-1 text-[10.24px] uppercase text-black hover:text-[#323232]">
                    <span>{`${isSummaryVisible ? 'Hide' : 'Show'} Order Summary`}</span>
                    <CaretIcon
                      className={isSummaryVisible ? 'rotate-180' : 'rotate-0'}
                    />
                  </span>
                </div>
                <div className="text-right text-black text-[12.8px] leading-none font-normal">
                  {`$${draftOrder?.totalPrice}`}
                </div>
              </div>
            </div>
          </div>
        </CartSummaryMobileTrigger>
      )}
      {((!isDesktop && isSummaryVisible) || isDesktop) && (
        <CartSummary
          className={`flex flex-col justify-center items-center mdl:justify-start mdl:items-start px-[12.8px] pb-5 mdl:px-0 mdl:pb-0 mx-auto transition-all ${className}`}
          orderDetails={draftOrder}
        />
      )}
    </aside>
  );
}

function CartSummary({orderDetails, className = ''}) {
  const {selectedShippingMethod, setSelectedShippingMethod, customer} =
    useContext(CheckoutContext);

  const [shippingDiscount, setShippingDiscount] = useState(null);

  const Total = useMemo(() => {
    if (shippingDiscount) {
      return (
        Number(shippingDiscount?.price?.amount ?? 0) +
        Number(orderDetails?.totalPrice ?? 0) +
        Number(orderDetails?.totalTax ?? 0) -
        Number(orderDetails?.appliedDiscount?.amountV2?.amount ?? 0)
      );
    } else {
      return (
        Number(selectedShippingMethod?.price?.amount ?? 0) +
        Number(orderDetails?.totalPrice ?? 0) +
        Number(orderDetails?.totalTax ?? 0) -
        Number(orderDetails?.appliedDiscount?.amountV2?.amount ?? 0)
      );
    }
  }, [selectedShippingMethod, shippingDiscount, orderDetails]);


  function VIPDiscountProvider(newPrice) {
    const newState = {...selectedShippingMethod};
    newState.price = {
      amount: newPrice,
      currencyCode: orderDetails?.appliedDiscount?.amountV2?.currencyCode,
    };
    setShippingDiscount(() => ({
      ...newState,
      message: 'Free shipping for VIP customers!',
    }));
    // setSelectedShippingMethod(newState);
    return newState;
  }

  useEffect(() => {
    const VIPTag = 'fedexaccount';
    if (customer && customer?.tags?.includes(VIPTag)) {
      const updatedRate = VIPDiscountProvider('0.0');
      console.log('⇐-------------↓↓↓ updatedRate ↓↓↓-------------⇒');
      console.log({updatedRate});
      console.log('⇐-------------↑↑↑ updatedRate ↑↑↑-------------⇒');
    }
  }, [customer]);

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full flex flex-col justify-start items-start">
        {orderDetails?.lineItems?.nodes?.map((lineItem) => {
          return <CartItem key={lineItem.id} lineItem={lineItem} />;
        })}
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        <hr className="w-full border border-[#9a9a9a] my-4" />
        <div className="w-full flex flex-row justify-between item-center">
          <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">
            Subtotal
          </span>
          <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">{`$${orderDetails?.subtotalPrice}`}</span>
        </div>
        {orderDetails?.appliedDiscount !== null && (
          <>
            <div className="w-full flex flex-row justify-start item-center">
              <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">
                Order discount
              </span>
            </div>
            <div className="w-full flex flex-row justify-between item-center">
              <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px] uppercase inline-flex flex-row justify-start items-center gap-1 py-1">
                <span className="w-auto h-auto flex justify-center items-center">
                  <DiscountTagIcon className="w-[14px] h-[14px]" />
                </span>
                <span>{orderDetails?.appliedDiscount?.title}</span>
              </span>
              <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">
                {`- $${Number(orderDetails?.appliedDiscount?.amountV2?.amount).toFixed(2)}`}
              </span>
            </div>
          </>
        )}
        <div className="w-full flex flex-row justify-between item-center">
          <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">
            Shipping
          </span>
          <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">
            {selectedShippingMethod
              ? shippingDiscount
                ? shippingDiscount?.price?.amount
                : selectedShippingMethod?.price?.amount
              : `Enter shipping address`}
          </span>
        </div>
        {shippingDiscount !== null && (
          <>
            <div className="w-full flex flex-row justify-between item-center">
              <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px] uppercase inline-flex flex-row justify-start items-center gap-1 py-1">
                <span className="w-auto h-auto flex justify-center items-center">
                  <DiscountTagIcon className="w-[14px] h-[14px]" />
                </span>
                <span>{shippingDiscount?.message}</span>
              </span>
            </div>
          </>
        )}
        <div className="w-full flex flex-row justify-between item-center">
          <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">
            Estimated taxes
          </span>
          <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">
            {orderDetails?.totalTax}
          </span>
        </div>
        <hr className="w-full border border-[#9a9a9a] my-4" />
        <div className="w-full flex flex-row justify-between item-center">
          <span className="font-Univers-Light text-sm leading-[16.8px]">
            Total
          </span>
          <span className="font-Univers-Light">
            <span className="font-Univers-Light text-[10px] mdl:text-xs mdl:leading-[14.4px]">
              {orderDetails?.currencyCode}
            </span>
            <span className="ml-1 font-Eurostile-Next-Bold text-[12.8px] mdl:text-sm mdl:leading-[16.8px] text-black inline-block">
              {`$${Number(Total)?.toFixed(2)}`}
            </span>
          </span>
        </div>
        {orderDetails?.appliedDiscount !== null && (
          <div className="w-full flex flex-row justify-start item-center gap-2">
            <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px] uppercase inline-flex flex-row justify-start items-center gap-2 py-1">
              <span className="w-auto h-auto flex justify-center items-center">
                <SavingsTagIcon className="w-[18px] h-[18px]" />
              </span>
              <span>Total Savings</span>
              <span className="font-Univers-Light text-[12.8px] mdl:text-sm mdl:leading-[16.8px]">
                {`- $${(Number(orderDetails?.totalPrice) - Number(Total)).toFixed(2)}`}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CartSummaryMobileTrigger({
  setIsSummaryVisible,
  className = '',
  children,
}) {
  const clickHandler = () => {
    setIsSummaryVisible((prev) => !prev);
  };
  return (
    <div className={`summary_trigger ${className}`} onClick={clickHandler}>
      {children}
    </div>
  );
}

function CartItem({lineItem, className = ''}) {
  return (
    <div
      className={`max-w-[324px] max-h-[192px] line_item w-full h-full flex flex-row justify-start gap-5 py-[19.2px] items-start ${className}`}
    >
      <div className="image_content relative w-[54px] h-[54px] mdl:h-[80px] aspect-square mdl:aspect-auto flex justify-center items-center shadow-sm">
        <img
          className="w-auto h-full aspect-square mdl:aspect-auto object-cover align-middle"
          src={lineItem?.image?.url}
          alt={lineItem?.image?.altText}
        />
        <span className="absolute top-[-8px] right-[-22px] bg-white border border-[#DEDEDE] rounded-[5px] w-6 h-[18px] flex flex-row justify-center items-center font-Univers-Light text-[10px]">
          1
        </span>
      </div>
      <div className="description ml-2 h-full flex flex-col justify-start items-start">
        <span className="title font-Univers-Light text-[11px] mdl:text-sm mdl:leading-[16.6px]">
          {lineItem?.title}
        </span>
        <span className="variant font-Univers-Light text-[11px] mdl:text-[12px] mdl:leading-[14.4px]">
          {lineItem?.variant?.title}
        </span>
        {lineItem?.customAttributes?.map((attribute) => {
          <span className="qty hidden xlg:block font-Univers-Light text-[11px] mdl:text-[12px] mdl:leading-[14.4px]">
            {attribute?.key}: {attribute?.value}
          </span>;
        })}
      </div>
    </div>
  );
}
