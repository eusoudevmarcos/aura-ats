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
};

export type ControlledProps<T extends FieldValues> = CommonProps<T> & {
  control: Control<T>;
  register?: never;
};

export type RegisteredProps<T extends FieldValues> = CommonProps<T> & {
  register: UseFormRegister<T>;
  control?: never;
};

export type FormInputProps<T extends FieldValues> =
  | ControlledProps<T>
  | RegisteredProps<T>;

export type ContainerProps = {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  id?: string;
  className?: string;
};
