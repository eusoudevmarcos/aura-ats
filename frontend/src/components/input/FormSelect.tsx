import { ContainerProps } from '@/type/formInput.type';
import { FormSelectProps } from '@/type/formSelect.type';
import { getError } from '@/utils/getError';
import React from 'react';
import { Controller, FieldValues } from 'react-hook-form';

const Container: React.FC<ContainerProps> = ({
  children,
  label,
  id,
  className,
}) => (
  <div className={`mb-4 ${className || ''}`}>
    {label && (
      <label htmlFor={id} className="block text-primary mb-1 font-semibold">
        {label}
      </label>
    )}
    {children}
  </div>
);

export function FormSelect<T extends FieldValues>({
  name,
  control,
  register,
  errors,
  selectProps,
  label,
  placeholder,
  value,
  onChange,
  required,
}: FormSelectProps<T>) {
  const errorMessage = getError(errors, name);
  const id = selectProps?.id || name.toString();

  const baseClass =
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline border border-secondary';
  const errorClass = errorMessage ? 'border-red-500' : '';

  // Extrai classNameContainer de selectProps, deixando o resto em otherSelectProps
  const { classNameContainer, ...otherSelectProps } = selectProps || {};

  const selectClassName = [baseClass, errorClass, otherSelectProps?.className]
    .filter(Boolean)
    .join(' ');

  return (
    <Container id={id} label={label} className={classNameContainer}>
      <>
        {control ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id={id}
                className={selectClassName}
                {...otherSelectProps} // Espalha apenas as props restantes
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value)}
                required={required ?? otherSelectProps?.required}
              >
                {placeholder && (
                  <option value="" disabled>
                    {placeholder}
                  </option>
                )}
                {otherSelectProps?.children}
              </select>
            )}
          />
        ) : register ? (
          <select
            id={id}
            {...register(name)}
            className={selectClassName}
            {...otherSelectProps} // Espalha apenas as props restantes
            required={required ?? otherSelectProps?.required}
            defaultValue=""
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {otherSelectProps?.children}
          </select>
        ) : (
          <select
            id={id}
            className={selectClassName}
            {...otherSelectProps} // Espalha apenas as props restantes
            value={value}
            onChange={onChange}
            required={required}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {otherSelectProps?.children}
          </select>
        )}

        {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
      </>
    </Container>
  );
}
