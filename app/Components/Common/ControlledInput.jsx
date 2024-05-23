import {Controller, useFormContext} from 'react-hook-form';
import {CrossIcon, LockIcon, QuestionIcon} from '.';
import {IMaskInput} from 'react-imask';
import IMask from 'imask';

function ControlledInput({
  label,
  placeholder,
  name,
  type = 'text',
  max = '100',
  icon = null,
}) {
  const {
    control,
    formState: {errors},
    watch,
  } = useFormContext();

  const currentValue = watch(name) ?? '';

  const error = errors[name];
  return (
    <Controller
      control={control}
      name={name}
      render={(controllerProps) => {
        const {
          field: {onChange, onBlur, ref},
        } = controllerProps;

        return (
          <div>
            <div
              className={`bg-[#FFF] min-h-[52px]  rounded flex justify-between border ${error?.type === 'invalid_type' ? 'border-2 border-[#E62828]' : 'border-[#DEDEDE]'}`}
            >
              <div className="flex flex-col justify-center basis-11/12">
                {label && currentValue && (
                  <p className="text-xs font-[#707070] px-4 transition-all duration-300 ease-in-out">
                    {label}
                  </p>
                )}
                <InputByName
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  max={max}
                  onChange={onChange}
                  inputValue={currentValue}
                />
              </div>
              {icon && (
                <div className="flex items-center px-4">
                  {icon === 'lock' && <LockIcon />}
                  {icon === 'question' && <QuestionIcon />}
                  {icon === 'cross' && (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a onClick={() => {}}>
                      <CrossIcon />
                    </a>
                  )}
                </div>
              )}
            </div>
            {error && error.type !== 'invalid_type' && (
              <p className="text-[#E62828] text-sm">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export default ControlledInput;

const InputByName = ({
  name,
  type,
  placeholder,
  max,
  onChange,
  currentValue,
}) => {
  switch (name) {
    case 'cardNumber':
      return (
        <IMaskInput
          className="focus:outline-none focus:ring-0 w-full border-none px-4 py-0"
          mask={'0000 0000 0000 0000'}
          unmask={true}
          name={name}
          placeholder={placeholder || ''}
          autoComplete="cc-number"
          value={currentValue}
          onChange={onChange}
        />
      );
    case 'expiry':
      return (
        <IMaskInput
          className="focus:outline-none focus:ring-0 w-full border-none px-4 py-0"
          mask={'MM / YYYY'}
          blocks={{
            YY: {
              mask: '00',
            },
            MM: {
              mask: IMask.MaskedRange,
              from: 1,
              to: 12,
            },
          }}
          unmask={false}
          name={name}
          placeholder={placeholder || ''}
          value={currentValue}
          onChange={onChange}
        />
      );
    default:
      return (
        <input
          className="focus:outline-none focus:ring-0 w-full border-none px-4 py-0"
          name={name}
          type={type === 'number' ? 'tel' : type}
          maxLength={max}
          placeholder={placeholder || ''}
          size={100}
          onChange={onChange}
          value={currentValue}
        />
      );
  }
};
