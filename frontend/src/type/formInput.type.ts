import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { IMaskInputProps } from 'react-imask';

export type MaskProps = Omit<
  IMaskInputProps<any>,
  'name' | 'value' | 'onChange' | 'onAccept' | 'ref' | 'inputRef'
>;

type FormInputOnChange = (
  e: React.ChangeEvent<HTMLInputElement> | string
) => void;
type FormInputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => void;

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  classNameContainer?: string;
};

export type CommonProps<T extends FieldValues> = {
  name: Path<T>;
  errors?: FieldErrors<T>;
  inputProps?: InputProps;
  // Tornar maskProps opcional e corrigir tipagem
  maskProps?: MaskProps;
  label?: React.ReactNode | string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  // Corrigir tipagem do value para aceitar qualquer tipo de valor do form
  value?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  clear?: boolean;
  noControl?: boolean;
  onFocus?: FormInputOnFocus;
};

// Permite: apenas control, apenas register, ou nenhum dos dois. Nunca ambos juntos.
export type FormInputProps<T extends FieldValues> =
  | (CommonProps<T> & { control?: Control<T>; register?: never })
  | (CommonProps<T> & { register: UseFormRegister<T>; control?: never })
  | (CommonProps<T> & { control?: never; register?: never });

export type ContainerProps = {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  id?: string;
  className?: string;
};
