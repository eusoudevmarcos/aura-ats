// src/components/input/FormInput.tsx
import { FormInputProps } from '@/type/formInput.type';
import { getError } from '@/utils/getError';
import { dateFullValidate } from '@/utils/mask/date';
import { Controller, FieldValues } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Container } from './Container';

export function FormInput<T extends FieldValues>({
  name,
  control,
  register,
  errors,
  inputProps,
  maskProps,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: FormInputProps<T>) {
  const errorMessage = getError(errors, name);
  const id = inputProps?.id || name.toString();

  const baseClass =
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline border transition-all duration-200 disabled:opacity-90';
  const errorClass = errorMessage ? 'border-red-500' : '';

  const { classNameContainer, ...otherInputProps } = inputProps || {};
  const inputClassName = [baseClass, errorClass, otherInputProps?.className]
    .filter(Boolean)
    .join(' ');

  const isDateInput = type === 'date';

  // Função para converter Date para string DD/MM/YYYY
  const formatDateToDisplay = (date: any): string => {
    if (!date) return '';

    if (date instanceof Date && !isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    return '';
  };

  // Função para converter string DD/MM/YYYY para Date
  const parseDisplayToDate = (dateString: string): Date | null => {
    if (!dateString || dateString.length !== 10) return null;

    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);

    // Validações básicas
    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > 2100
    ) {
      return null;
    }

    const date = new Date(year, month - 1, day);

    // Verifica se a data é válida
    if (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    ) {
      return date;
    }

    return null;
  };

  const onAccept = (valueString: any, mask: any, onChangeFn: any) => {
    if (isDateInput) {
      if (mask.masked.isComplete && valueString.length === 10) {
        const parsedDate = parseDisplayToDate(valueString);
        onChangeFn(parsedDate);
      } else {
        onChangeFn(null);
      }
    } else {
      onChangeFn(valueString);
    }
  };

  return (
    <Container id={id} label={label} className={classNameContainer}>
      <>
        {control ? (
          <Controller
            name={name}
            control={control}
            render={({
              field: {
                onChange: controllerOnChange,
                onBlur,
                value: controllerValue,
                ref,
              },
            }) => {
              const displayValue = isDateInput
                ? formatDateToDisplay(controllerValue)
                : (controllerValue as any);

              return (
                <IMaskInput
                  mask={isDateInput ? 'DD/MM/YYYY' : (maskProps?.mask as any)}
                  blocks={isDateInput ? dateFullValidate() : undefined}
                  inputRef={ref}
                  id={id}
                  className={inputClassName}
                  placeholder={
                    placeholder || (isDateInput ? 'DD/MM/YYYY' : undefined)
                  }
                  value={displayValue || ''}
                  onAccept={(valueString: any, mask: any) =>
                    onAccept(valueString, mask, controllerOnChange)
                  }
                  onBlur={onBlur}
                  type="text" // Sempre text para usar a máscara
                  {...otherInputProps}
                />
              );
            }}
          />
        ) : register ? (
          <input
            id={id}
            {...register(name)}
            {...otherInputProps}
            className={inputClassName}
            placeholder={placeholder}
            type={isDateInput ? 'text' : type}
            autoComplete="off"
            onChange={onChange}
          />
        ) : (
          <input
            id={id}
            type={isDateInput ? 'text' : type}
            className={inputClassName}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...(typeof otherInputProps === 'object' && otherInputProps !== null
              ? otherInputProps
              : {})}
          />
        )}

        {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
      </>
    </Container>
  );
}
