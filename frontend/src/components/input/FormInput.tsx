// src/components/input/FormInput.tsx
import { FormInputProps } from '@/type/formInput.type';
import { getError } from '@/utils/getError';
import React from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Container } from './Container';
import { ErrorMessage } from './ErrorMessage';

export function FormInput<T extends FieldValues>({
  name,
  inputProps,
  maskProps,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onKeyDown,
  control: externalControl,
  errors: externalErrors,
  noControl = false,
  clear = false,
}: FormInputProps<T> & { noControl?: boolean }) {
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
          onChange(newValue);
        } else {
          const syntheticEvent = {
            target: { value: newValue, name: name.toString() },
            currentTarget: { value: newValue, name: name.toString() },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }
    };

    return (
      <InputElement
        ref={field?.ref}
        id={id}
        type={type}
        className={inputClassName}
        placeholder={placeholder}
        value={field ? field.value || '' : value || ''}
        onChange={handleChange}
        onBlur={field?.onBlur}
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
                  onChange('' as any);
                } else {
                  const syntheticEvent = {
                    target: { value: '', name: name.toString() },
                    currentTarget: { value: '', name: name.toString() },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChange(syntheticEvent);
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

// Input com/sem máscara
const InputElement = React.forwardRef<HTMLInputElement, any>(
  ({ maskProps, onChange, onKeyDown, ...props }, ref) => {
    if (maskProps?.mask) {
      return (
        <IMaskInput
          inputRef={ref}
          onChange={onChange}
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
        onChange={e => onChange(e)}
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
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline transition-all duration-200 disabled:opacity-90';
  const errorClass = errorMessage ? 'border-red-500' : '';
  return [base, errorClass, customClassName].filter(Boolean).join(' ');
}
