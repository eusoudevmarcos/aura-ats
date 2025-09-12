// src/components/input/FormInput.tsx
import { FormInputProps } from '@/type/formInput.type';
import { getError } from '@/utils/getError';
import React from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Container } from './Container';

export function FormInput<T extends FieldValues>({
  name,
  inputProps,
  maskProps,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  control: externalControl,
  register: externalRegister,
  errors: externalErrors,
  clear = false,
}: FormInputProps<T>) {
  const formContext = useFormContext<T>();
  const control = externalControl || formContext?.control;
  const errors = externalErrors || formContext?.formState?.errors;

  const errorMessage = getError(errors, name);
  const id = inputProps?.id || name.toString();

  const setValue = formContext?.setValue; // ✅ pegar setValue
  const watch = formContext?.watch; // ✅ pegar watch

  const watchValue = watch ? watch(name) : value;

  // Separar props do input das props do container
  const { classNameContainer, ...otherInputProps } = inputProps || {};

  // Classes do input
  const inputClassName = buildInputClasses(
    errorMessage ?? null,
    otherInputProps?.className
  );

  // Se usa react-hook-form
  if (control) {
    return (
      <Container id={id} label={label} className={classNameContainer}>
        <div className="relative">
          <Controller
            name={name}
            control={control}
            render={({
              field: {
                onChange: fieldOnChange,
                onBlur,
                value: fieldValue,
                ref,
              },
            }) => (
              <InputElement
                ref={ref}
                id={id}
                type={type}
                className={inputClassName}
                placeholder={placeholder}
                value={fieldValue || ''}
                onChange={(newValue: any) => fieldOnChange(newValue)}
                onBlur={onBlur}
                maskProps={maskProps}
                {...otherInputProps}
              />
            )}
          />

          {clear && (
            <ClearButton
              value={watchValue}
              onClear={() => {
                if (setValue) {
                  setValue(name, '' as any, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
            />
          )}
        </div>

        <ErrorMessage message={errorMessage ?? null} />
      </Container>
    );
  }

  // Fallback para uso sem react-hook-form
  return (
    <Container id={id} label={label} className={classNameContainer}>
      <div className="relative">
        <InputElement
          id={id}
          type={type}
          className={inputClassName}
          placeholder={placeholder}
          value={value || ''}
          onChange={(newValue: any) => {
            if (onChange) {
              const syntheticEvent = {
                target: { value: newValue },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }
          }}
          maskProps={maskProps}
          {...otherInputProps}
        />

        {clear && (
          <ClearButton
            value={value}
            onClear={() => {
              if (onChange) {
                const syntheticEvent = {
                  target: { value: '' },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
              }
            }}
          />
        )}
      </div>

      <ErrorMessage message={errorMessage ?? null} />
    </Container>
  );
}

// Componente do input (com ou sem máscara)
interface InputElementProps {
  id: string;
  type: string;
  className: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  maskProps?: any;
  ref?: any;
  [key: string]: any;
}

const InputElement = React.forwardRef<HTMLInputElement, InputElementProps>(
  ({ maskProps, onChange, ...props }, ref) => {
    const hasMask = Boolean(maskProps?.mask);

    if (hasMask) {
      return (
        <IMaskInput
          inputRef={ref}
          onAccept={(value: string) => onChange(value)}
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
        autoComplete="off"
        {...props}
      />
    );
  }
);

// Botão de limpar
interface ClearButtonProps {
  value: any;
  onClear: () => void;
}

const ClearButton = ({ value, onClear }: ClearButtonProps) => {
  const hasValue = value && String(value).trim() !== '';

  if (!hasValue) return null;

  return (
    <button
      type="button"
      onClick={onClear}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
      tabIndex={-1}
    >
      <span className="material-icons-outlined">close</span>
    </button>
  );
};

// Mensagem de erro
const ErrorMessage = ({ message }: { message: string | null }) => {
  if (!message) return null;

  return <p className="text-red-500 text-xs italic mt-1">{message}</p>;
};

// Função para construir classes do input
function buildInputClasses(
  errorMessage: string | null,
  customClassName?: string
): string {
  const baseClass =
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline transition-all duration-200 disabled:opacity-90';
  const errorClass = errorMessage ? 'border-red-500' : '';

  return [baseClass, errorClass, customClassName].filter(Boolean).join(' ');
}
