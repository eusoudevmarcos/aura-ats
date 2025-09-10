// src/components/input/FormInput.tsx
import { FormInputProps } from '@/type/formInput.type';
import { getError } from '@/utils/getError';
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
}: FormInputProps<T>) {
  const formContext = useFormContext<T>();
  const control = externalControl || formContext?.control;
  const errors = externalErrors || formContext?.formState?.errors;

  const errorMessage = getError(errors, name);
  const id = inputProps?.id || name.toString();

  const baseClass =
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline border transition-all duration-200 disabled:opacity-90';
  const errorClass = errorMessage ? 'border-red-500' : '';

  const { classNameContainer, ...otherInputProps } = inputProps || {};
  const inputClassName = [baseClass, errorClass, otherInputProps?.className]
    .filter(Boolean)
    .join(' ');

  const hasMask = Boolean(maskProps?.mask);

  // Se tem contexto do form, usa Controller
  if (control) {
    return (
      <Container id={id} label={label} className={classNameContainer}>
        <>
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
            }) => {
              if (hasMask) {
                const field = fieldValue as any;
                return (
                  <IMaskInput
                    inputRef={ref}
                    id={id}
                    className={inputClassName}
                    placeholder={placeholder}
                    value={field}
                    onAccept={(value: string) => fieldOnChange(value)}
                    onBlur={onBlur}
                    autoComplete="off"
                    {...(maskProps as any)}
                    {...otherInputProps}
                  />
                );
              }

              return (
                <input
                  ref={ref}
                  id={id}
                  type={type}
                  className={inputClassName}
                  placeholder={placeholder}
                  value={fieldValue}
                  onChange={e => fieldOnChange(e.target.value)}
                  onBlur={onBlur}
                  autoComplete="off"
                  {...otherInputProps}
                />
              );
            }}
          />

          {errorMessage && (
            <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
          )}
        </>
      </Container>
    );
  }

  // Fallback para uso sem react-hook-form (input controlado manualmente)
  const {
    onChange: inputOnChange,
    onBlur: inputOnBlur,
    value: inputValue,
    ...cleanInputProps
  } = otherInputProps || {};

  return (
    <Container id={id} label={label} className={classNameContainer}>
      <>
        {hasMask ? (
          (() => {
            // Props específicas do IMaskInput para o caso sem react-hook-form
            const maskInputProps = {
              id,
              className: inputClassName,
              placeholder,
              value: value,
              onAccept: (maskValue: string) => {
                if (onChange) {
                  const syntheticEvent = {
                    target: { value: maskValue },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChange(syntheticEvent);
                }
              },
              ...maskProps,
            } as any; // Casting para resolver conflitos de tipagem do IMask

            return <IMaskInput {...maskInputProps} />;
          })()
        ) : (
          <input
            id={id}
            type={type}
            className={inputClassName}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...cleanInputProps}
          />
        )}

        {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
      </>
    </Container>
  );
}
