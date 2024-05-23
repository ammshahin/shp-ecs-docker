import {useContext, useState} from 'react';
import {CheckoutContext} from '~/Context';
import {CheckboxIcon} from '~/Components/Common';

export function Checkbox({label, checked = false, onChange, ...props}) {
  const defaultChecked = checked ? checked : false;
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const {isDesktop} = useContext(CheckoutContext);

  const handleInputChange = (e) => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange && onChange(e, newValue);
  };

  return (
    <div className="flex flex-row justify-start items-center gap-2">
      <input
        id={label.toLowerCase()}
        name={label.toLowerCase()}
        type="checkbox"
        {...props}
        onChange={handleInputChange}
        value={label.toLowerCase()}
        className="hidden border border-solid border-black rounded-[5px]"
      />
      <label
        htmlFor={label.toLowerCase()}
        className="flex flex-row justify-center items-center gap-2 h-[25px] cursor-pointer"
      >
        <div className="flex flex-row justify-center items-center">
          <CheckboxIcon checked={isChecked} />
        </div>
        <div
          className={`flex flex-row justify-center items-center ${
            isDesktop ? 'text-[13px]' : 'text-[14px]'
          }`}
        >
          {label}
        </div>
      </label>
    </div>
  );
}
