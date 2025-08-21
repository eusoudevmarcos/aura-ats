import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { IMaskInputProps } from "react-imask";

export type CommonProps<T extends FieldValues> = {
  name: Path<T>;
  errors?: FieldErrors<T>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    classNameContainer?: string;
  };
  maskProps?: Omit<
    IMaskInputProps<any>,
    "name" | "value" | "onChange" | "onAccept" | "ref"
  >;
  label?: React.ReactNode | string;
  placeholder?: string;
  type?: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: any;
};

// Permite: apenas control, apenas register, ou nenhum dos dois. Nunca ambos juntos.
export type FormInputProps<T extends FieldValues> =
  | (CommonProps<T> & { control: Control<T>; register?: never })
  | (CommonProps<T> & { register: UseFormRegister<T>; control?: never })
  | (CommonProps<T> & { control?: undefined; register?: undefined });

export type ContainerProps = {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  id?: string;
  className?: string;
};
