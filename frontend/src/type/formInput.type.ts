import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { IMaskInputProps, ReactMaskProps } from 'react-imask';

export type MaskProps = Omit<
  IMaskInputProps<HTMLInputElement> &
    Partial<
      ReactMaskProps<HTMLInputElement, IMaskInputProps<HTMLInputElement>>
    >,
  'name' | 'value' | 'onChange' | 'onAccept' | 'ref' | 'inputRef'
> & {
  blocks?: Record<string, any>;
};

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
  // maskProps agora tipada para uso avançado do react-imask e aceita 'blocks'
  maskProps?: MaskProps;
  label?: React.ReactNode | string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  clear?: boolean;
  noControl?: boolean;
  onFocus?: FormInputOnFocus;
  required?: boolean;
};

// Permite: apenas control, apenas register, ou nenhum dos dois. Nunca ambos juntos.
export type FormInputProps<T extends FieldValues> =
  | CommonProps<T> & { control?: Control<T> };

export type ContainerProps = {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  id?: string;
  className?: string;
};
