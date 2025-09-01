// src/components/input/FormTextarea.tsx
import { getError } from '@/utils/getError';
import React, { TextareaHTMLAttributes } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Container } from './Container';

type FormTextareaProps = {
  name: string;
  register: UseFormRegister<any>;
  errors?: FieldErrors<any>;
  placeholder?: string;
  label?: string;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    classNameContainer?: string;
  };
};

export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  register,
  errors,
  placeholder,
  label,
  textareaProps,
}) => {
  const errorMessage = getError(errors, name);
  const { classNameContainer, ...restTextareaProps } = textareaProps || {};

  return (
    <Container label={label} className={classNameContainer}>
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errorMessage ? 'border-red-500' : ''
        }`}
        rows={4}
        {...restTextareaProps}
      />
      {errorMessage && (
        <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
      )}
    </Container>
  );
};
