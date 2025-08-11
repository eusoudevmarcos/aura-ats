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
import { IMaskInput, IMaskInputProps } from "react-imask";

type CommonProps<T extends FieldValues> = {
  name: Path<T>;
  errors?: FieldErrors<T>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  maskProps?: Omit<
    IMaskInputProps<any>,
    "name" | "value" | "onChange" | "onAccept" | "ref"
  >;
  label?: React.ReactNode | string;
  placeholder?: string;
  type?: string;
};

type ControlledProps<T extends FieldValues> = CommonProps<T> & {
  control: Control<T>;
  register?: never; // proíbe usar register junto com control
};

type RegisteredProps<T extends FieldValues> = CommonProps<T> & {
  register: UseFormRegister<T>;
  control?: never; // proíbe usar control junto com register
};

type FormInputProps<T extends FieldValues> =
  | ControlledProps<T>
  | RegisteredProps<T>;

type ContainerProps = {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  id?: string;
};

const Container: React.FC<ContainerProps> = ({ children, label, id }) => (
  <div className="mb-4">
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
    "shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline";
  const errorClass = errorMessage ? "border-red-500" : "";
  const className = [baseClass, errorClass, inputProps?.className]
    .filter(Boolean)
    .join(" ");

  if (control) {
    return (
      <Container id={id} label={label}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <IMaskInput
              {...field}
              {...maskProps}
              mask={maskProps?.mask as any}
              inputRef={field.ref}
              id={id}
              className={className}
              onAccept={(value) => field.onChange(value)}
              type={type}
              placeholder={placeholder}
            />
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
      <Container id={id} label={label}>
        <input
          id={id}
          {...register(name)}
          {...inputProps}
          className={className}
          placeholder={placeholder}
          type={type}
        />
        {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
      </Container>
    );
  }

  return (
    <Container id={id} label={label}>
      <input
        id={id}
        type={type}
        className={className}
        placeholder={placeholder}
        {...(typeof inputProps === "object" && inputProps !== null
          ? inputProps
          : {})}
      />
    </Container>
  );
}
