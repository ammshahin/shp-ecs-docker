import React, {useContext} from 'react';
import {CheckoutContext} from '~/Context';

export function PurchaseBlock({className = '_action_1n6lm_13'}) {
  const {setPurchaseOrderNumber} = useContext(CheckoutContext);
  return (
    <div
      className={`w-full flex flex-col justify-start items-start ${className}`}
    >
      <div className="relative box-border mb-2 mdl:mb-5 flex-[1_1_auto]">
        <h2 className="font-Eurostile-Next-Bold text-black text-base mdl:text-[20px] leading-normal tracking-[-0.4px] flex-[1_1_auto]">
          Purchase Order Number
        </h2>
      </div>
      <div className="relative flex justify-start items-center w-full">
        <input
          className="w-full h-[42px] mdl:h-[52px] flex flex-col justify-center items-start gap-[2px] flex-[1_0_0] font-Univers-Light text-sm font-light leading-normal border border-[#DEDEDE] rounded-[5px] p-[6.67px] mdl:px-[9px] py-[10px]"
          type="tel"
          name="Purchase Order Number"
          id="Purchase_Order_Number"
          placeholder="Purchase Order Number"
          onChange={(e) => setPurchaseOrderNumber(e.target.value)}
        />
      </div>
    </div>
  );
}
