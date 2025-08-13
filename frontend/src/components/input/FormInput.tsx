import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { ContainerProps, FormInputProps } from "@/type/FormInput";
import { convertDateFromPostgres } from "@/utils/date/convertDateFromPostgres";
import { convertDateToPostgres } from "@/utils/date/convertDateToPostgres";
import { getError } from "@/utils/getError";
import { dateFullValidate } from "@/utils/mask/date";

const Container: React.FC<ContainerProps> = ({
  children,
  label,
  id,
  className,
}) => (
  <div className={`mb-4 ${className || ""}`}>
    {label && (
      <label htmlFor={id} className="block text-gray-700 mb-1 font-semibold">
        {label}
      </label>
    )}
    {children}
  </div>
);

export function FormInput<T extends FieldValues>({
  name,
  control,
  register,
  errors,
  inputProps,
  maskProps,
  label,
  placeholder,
  type = "text",
}: FormInputProps<T>) {
  if (control && register) {
    throw new Error(
      `Componente ${name}: 'control' e 'register' não podem estar juntos`
    );
  }

  const errorMessage = getError(errors, name);

  const id = inputProps?.id || name.toString();

  const baseClass =
    "shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline border border-[#8c53ff]";
  const errorClass = errorMessage ? "border-red-500" : "";

  const { classNameContainer, ...otherInputProps } = inputProps || {};

  const inputClassName = [baseClass, errorClass, otherInputProps?.className]
    .filter(Boolean)
    .join(" ");

  const isDateInput = type === "date";

  const onAccept = (valueString: string, mask: any, onChange: any) => {
    if (isDateInput) {
      mask.masked.isComplete
        ? onChange(convertDateToPostgres(valueString))
        : onChange(undefined);
    } else {
      onChange(valueString);
    }
  };

  return (
    <Container id={id} label={label} className={classNameContainer}>
      <>
        {control ? (
          <Controller
            name={name}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              const displayValue = isDateInput
                ? convertDateFromPostgres(value as string)
                : (value as string);

              return (
                <IMaskInput
                  mask={isDateInput ? "DD/MM/YYYY" : (maskProps?.mask as any)}
                  blocks={isDateInput ? dateFullValidate() : undefined}
                  inputRef={ref}
                  id={id}
                  className={inputClassName} // Usa inputClassName
                  placeholder={
                    placeholder || (isDateInput ? "DD/MM/YYYY" : undefined)
                  }
                  value={(displayValue || "") as any}
                  onAccept={(valueString: string, mask: any) =>
                    onAccept(valueString, mask, onChange)
                  }
                  onBlur={onBlur}
                  type={isDateInput ? "text" : type}
                  {...otherInputProps}
                  {...(!isDateInput ? maskProps : {})}
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
            type={type}
          />
        ) : (
          <input
            id={id}
            type={type}
            className={inputClassName} // Usa inputClassName
            placeholder={placeholder}
            {...(typeof otherInputProps === "object" && otherInputProps !== null
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
