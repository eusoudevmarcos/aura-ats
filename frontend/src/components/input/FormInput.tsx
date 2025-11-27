// src/components/input/FormInput.tsx
import { FormInputProps } from '@/type/formInput.type';
import { getError } from '@/utils/getError';
import React from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Container } from './Container';
import { ErrorMessage } from './ErrorMessage';

type FormInputOnChange = (
  e: React.ChangeEvent<HTMLInputElement> | string
) => void;
type FormInputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => void;

export function FormInput<T extends FieldValues>({
  name,
  inputProps,
  maskProps,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onFocus,
  onKeyDown,
  control: externalControl,
  errors: externalErrors,
  noControl = false,
  clear = false,
}: FormInputProps<T>) {
  const formContext = useFormContext<T>();
  const control = externalControl || formContext?.control;
  const errors = externalErrors || formContext?.formState?.errors;
  const errorMessage = getError(errors, name);
  const id = inputProps?.id || name.toString();

  const setValue = formContext?.setValue;
  const watch = formContext?.watch;
  const watchValue = watch ? watch(name) : value;

  const { classNameContainer, ...otherInputProps } = inputProps || {};
  const inputClassName = buildInputClasses(
    errorMessage ?? null,
    otherInputProps?.className
  );

  const renderInput = (field?: {
    value: any;
    onChange: (val: any) => void;
    onBlur: () => void;
    ref: any;
  }) => {
    const handleChange = (newValue: any) => {
      // Atualiza react-hook-form (se existir)
      field?.onChange?.(newValue);

      // Chama o onChange customizado
      if (onChange) {
        if (maskProps?.mask) {
          // Chama direto com valor puro (IMask repassa value string)
          (onChange as FormInputOnChange)(newValue);
        } else {
          const syntheticEvent = {
            target: { value: newValue, name: name.toString() },
            currentTarget: { value: newValue, name: name.toString() },
          } as React.ChangeEvent<HTMLInputElement>;
          (onChange as FormInputOnChange)(syntheticEvent);
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e);
      }
    };

    return (
      <InputElement
        ref={field?.ref}
        id={id}
        type={type}
        className={inputClassName}
        placeholder={placeholder}
        value={field ? field.value ?? '' : value ?? ''}
        onChange={handleChange}
        onBlur={field?.onBlur}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        maskProps={maskProps}
        {...otherInputProps}
      />
    );
  };

  return (
    <Container id={id} label={label} className={classNameContainer}>
      <div className="relative">
        {control && !noControl ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => renderInput(field)}
          />
        ) : (
          renderInput()
        )}

        {clear && (
          <ClearButton
            value={watchValue ?? value}
            onClear={() => {
              if (setValue) {
                setValue(name, '' as any, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
              if (onChange) {
                if (maskProps?.mask) {
                  (onChange as FormInputOnChange)('' as any);
                } else {
                  const syntheticEvent = {
                    target: { value: '', name: name.toString() },
                    currentTarget: { value: '', name: name.toString() },
                  } as React.ChangeEvent<HTMLInputElement>;
                  (onChange as FormInputOnChange)(syntheticEvent);
                }
              }
            }}
          />
        )}
        {/* Mensagem de erro flutuante em formato de balão */}
        <ErrorMessage message={errorMessage ?? null} />
      </div>
    </Container>
  );
}

type InputElementProps = React.InputHTMLAttributes<HTMLInputElement> & {
  maskProps?: any;
  onChange: (value: any) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

// Input com/sem máscara
const InputElement = React.forwardRef<HTMLInputElement, InputElementProps>(
  ({ maskProps, onChange, onKeyDown, onFocus, ...props }, ref) => {
    if (maskProps?.mask) {
      return (
        <IMaskInput
          inputRef={ref}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          autoComplete="off"
          {...maskProps}
          {...props}
        />
      );
    }
    return (
      <input
        ref={ref}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        autoComplete="off"
        {...props}
      />
    );
  }
);

InputElement.displayName = 'InputElement';

const ClearButton = ({ value, onClear }: { value: any; onClear: () => void }) =>
  value && String(value).trim() !== '' ? (
    <button
      type="button"
      onClick={onClear}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
      tabIndex={-1}
    >
      <span className="material-icons-outlined">close</span>
    </button>
  ) : null;

function buildInputClasses(
  errorMessage: string | null,
  customClassName?: string
) {
  const base =
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline transition-all duration-200 disabled:opacity-90 focus:border-primary placeholder:text-md min-h-[42px]';
  const errorClass = errorMessage ? 'border-red-500' : '';
  return [base, errorClass, customClassName].filter(Boolean).join(' ');
}
