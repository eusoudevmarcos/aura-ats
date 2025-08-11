import { getError } from "@/utils/getError";
import React from "react";
import {
  Controller,
  Control,
  FieldErrors,
  Path,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";

type CommonSelectProps<T extends FieldValues> = {
  name: Path<T>;
  errors?: FieldErrors<T>;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement> & {
    classNameContainer?: string;
  };
  label?: React.ReactNode | string;
  placeholder?: string;

  // Para controlar manualmente (sem react-hook-form)
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  required?: boolean;
};

type ControlledSelectProps<T extends FieldValues> = CommonSelectProps<T> & {
  control: Control<T>;
  register?: never;
};

type RegisteredSelectProps<T extends FieldValues> = CommonSelectProps<T> & {
  register: UseFormRegister<T>;
  control?: never;
};

type ManualSelectProps<T extends FieldValues> = CommonSelectProps<T> & {
  control?: never;
  register?: never;
};

type FormSelectProps<T extends FieldValues> =
  | ControlledSelectProps<T>
  | RegisteredSelectProps<T>
  | ManualSelectProps<T>;

type ContainerProps = {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  id?: string;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({
  children,
  label,
  id,
  className,
}) => (
  <div className={`${className}`}>
    {label && (
      <label htmlFor={id} className="block text-[#48038a] mb-1 font-semibold">
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
  if (control && register) {
    throw new Error(
      `Componente ${name}: 'control' e 'register' não podem estar juntos`
    );
  }

  const errorMessage = getError(errors, name);
  const id = selectProps?.id || name.toString();

  const baseClass =
    "shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline";
  const errorClass = errorMessage ? "border-red-500" : "";
  const className = [baseClass, errorClass, selectProps?.className]
    .filter(Boolean)
    .join(" ");

  if (control) {
    return (
      <Container
        id={id}
        label={label}
        className={selectProps?.classNameContainer}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id={id}
              className={className}
              {...selectProps}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              required={required ?? selectProps?.required}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {selectProps?.children}
            </select>
          )}
        />
        {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
      </Container>
    );
  }

  if (register) {
    return (
      <Container
        id={id}
        label={label}
        className={selectProps?.classNameContainer}
      >
        <select
          id={id}
          {...register(name)}
          className={className}
          {...selectProps}
          required={required ?? selectProps?.required}
          defaultValue=""
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {selectProps?.children}
        </select>
        {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
      </Container>
    );
  }

  return (
    <Container
      id={id}
      label={label}
      className={selectProps?.classNameContainer}
    >
      <select
        id={id}
        className={className}
        {...selectProps}
        value={value}
        onChange={onChange}
        required={required}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {selectProps?.children}
      </select>
      {errorMessage && (
        <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
      )}
    </Container>
  );
}
