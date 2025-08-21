// src/components/input/FormTextarea.tsx
import React, { TextareaHTMLAttributes } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { getError } from "@/utils/getError";

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
    <div className={`mb-4 ${classNameContainer || ""}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-[#48038a] text-sm font-bold mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[#8c53ff] ${
          errorMessage ? "border-red-500" : ""
        }`}
        rows={4} // Default rows for a textarea
        {...restTextareaProps}
      />
      {errorMessage && (
        <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
