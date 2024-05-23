import {useState} from 'react';

export function SelectOption({
  value,
  setValue,
  label,
  options,
  className = '',
  ...props
}) {
  return (
    <>
      <label className="absolute text-xs top-0 w-full font-normal my-[5px] text-[#737373] transition-all px-2.5 z-[1] pointer-events-none whitespace-nowrap overflow-ellipsis box-border">
        {label}
      </label>
      <select
        className={`w-full border border-[#D9D9D9] text-[#333333] bg-white rounded-[5px] text-sm leading-none ${className}`}
        placeholder={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-required="true"
        {...props}
      >
        {options?.map((option) => {
          return (
            <option
              key={option?.id}
              value={option?.name}
              className="text-[12.8px]"
            >
              {option?.name}
            </option>
          );
        })}
      </select>
    </>
  );
}
