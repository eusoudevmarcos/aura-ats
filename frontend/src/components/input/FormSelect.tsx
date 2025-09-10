// src/components/input/FormSelect.tsx
import { FormSelectProps } from '@/type/formSelect.type';
import { getError } from '@/utils/getError';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { Container } from '../input/Container';

export function FormSelect<T extends FieldValues>({
  name,
  selectProps,
  label,
  placeholder,
  value,
  onChange,
  required,
  children,
  control: externalControl,
  register: externalRegister,
  errors: externalErrors,
}: FormSelectProps<T>) {
  const formContext = useFormContext<T>();
  const control = externalControl || formContext?.control;
  const errors = externalErrors || formContext?.formState?.errors;

  const errorMessage = getError(errors, name);
  const id = selectProps?.id || name.toString();

  const baseClass =
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline border transition-all duration-200 disabled:opacity-90';
  const errorClass = errorMessage ? 'border-red-500' : '';

  const {
    classNameContainer,
    children: selectChildren,
    ...otherSelectProps
  } = selectProps || {};

  const selectClassName = [baseClass, errorClass, otherSelectProps?.className]
    .filter(Boolean)
    .join(' ');

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
            }) => (
              <select
                ref={ref}
                id={id}
                className={selectClassName}
                value={fieldValue ?? ''}
                onChange={e => fieldOnChange(e.target.value)}
                onBlur={onBlur}
                required={required}
                {...otherSelectProps}
              >
                {placeholder && (
                  <option value="" disabled>
                    {placeholder}
                  </option>
                )}
                {children}
              </select>
            )}
          />

          {errorMessage && (
            <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
          )}
        </>
      </Container>
    );
  }

  // Fallback para uso sem react-hook-form (select controlado manualmente)
  return (
    <Container id={id} label={label} className={classNameContainer}>
      <>
        <select
          id={id}
          className={selectClassName}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          {...otherSelectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
      </>
    </Container>
  );
}
