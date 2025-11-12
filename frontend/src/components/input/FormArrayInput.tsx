import { MaskProps } from '@/type/formInput.type';
import React, { useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
import { Container } from './Container';

interface FieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  component?: 'input' | 'select';
  selectOptions?: { value: any; label: string }[];
  required?: boolean;
  maskProps?: MaskProps;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    classNameContainer?: string;
  };
}

interface FormArrayInputProps {
  name?: string;
  title: string;
  addButtonText: string;
  fieldConfigs: FieldConfig[];
  renderChipContent: (item: any, index: number) => React.ReactNode;
  initialItemData?: any;
  containerClassName?: string;
  buttonPosition?: 'end' | 'side';
  ValuesArrayString?: boolean;
  value: any[]; // O array que esse componente controla
  onChange: (value: any[]) => void; // Notifica o pai sobre mudanças
  validateCustom?: (
    value: any,
    fieldConfigs: any,
    setItemError: React.Dispatch<React.SetStateAction<string | null>>
  ) => boolean;
}

export function FormArrayInput({
  name,
  title,
  addButtonText,
  fieldConfigs,
  renderChipContent,
  initialItemData = {},
  containerClassName,
  ValuesArrayString = false,
  value,
  onChange,
  validateCustom,
}: FormArrayInputProps) {
  // Estados locais
  const [newItemValues, setNewItemValues] = useState<Record<string, any>>(
    () => {
      const defaultValues: Record<string, any> = {};
      fieldConfigs.forEach(config => {
        defaultValues[config.name] =
          initialItemData[config.name] !== undefined
            ? initialItemData[config.name]
            : '';
      });
      return defaultValues;
    }
  );

  const [itemError, setItemError] = useState<string | null>(null);

  const handleInputChange = (fieldName: string, inputValue: any) => {
    setNewItemValues(prev => ({
      ...prev,
      [fieldName]: inputValue,
    }));
    if (itemError) setItemError(null);
  };

  const validateItem = (): boolean => {
    for (const config of fieldConfigs) {
      const val = newItemValues[config.name];

      // Required
      if (config.required && (!val || String(val).trim() === '')) {
        setItemError(`O campo '${config.label || config.name}' é obrigatório.`);
        return false;
      }

      if (
        config.type === 'email' &&
        typeof val === 'string' &&
        val.length > 0
      ) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve conter um e-mail válido.`
          );
          return false;
        }
      }

      if (
        config.inputProps?.min !== undefined &&
        val !== undefined &&
        val !== ''
      ) {
        // Min (number)
        const numValue = Number(val);
        const minValue = Number(config.inputProps.min);
        if (!isNaN(numValue) && !isNaN(minValue) && numValue < minValue) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve ser maior ou igual a ${minValue}.`
          );
          return false;
        }
      }
      // Max (number)
      if (
        config.inputProps?.max !== undefined &&
        val !== undefined &&
        val !== ''
      ) {
        const numValue = Number(val);
        const maxValue = Number(config.inputProps.max);
        if (!isNaN(numValue) && !isNaN(maxValue) && numValue > maxValue) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve ser menor ou igual a ${maxValue}.`
          );
          return false;
        }
      }
      // minLength
      if (
        config.inputProps?.minLength !== undefined &&
        typeof val === 'string'
      ) {
        const minLen = Number(config.inputProps.minLength);
        if (val.length < minLen) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve ter ao menos ${minLen} caracteres.`
          );
          return false;
        }
      }
      // maxLength
      if (
        config.inputProps?.maxLength !== undefined &&
        typeof val === 'string'
      ) {
        const maxLen = Number(config.inputProps.maxLength);
        if (val.length > maxLen) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve ter no máximo ${maxLen} caracteres.`
          );
          return false;
        }
      }
      if (validateCustom) return validateCustom(val, config, setItemError);
    }

    return true;
  };

  const handleAddItem = (fieldName?: any) => {
    if (!validateItem()) return;
    const newItem = ValuesArrayString
      ? newItemValues[fieldName]
      : { ...newItemValues };
    let newArray: any[];

    if (ValuesArrayString) {
      newArray = [...value, newItem];
    } else {
      newArray = [...value, { ...newItem }];
    }
    onChange(newArray);

    setItemError(null);

    // Reseta os campos após adicionar
    const resetValues: Record<string, any> = {};
    fieldConfigs.forEach(config => {
      resetValues[config.name] =
        initialItemData[config.name] !== undefined
          ? initialItemData[config.name]
          : '';
    });
    setNewItemValues(resetValues);
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <Container label={title} className={containerClassName}>
      {/* Campos de entrada */}
      <div className="space-y-4 mb-4">
        <div
          className={`grid gap-4 ${
            fieldConfigs.length === 1
              ? 'grid-cols-1'
              : fieldConfigs.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {fieldConfigs.map(config => {
            const fieldValue = newItemValues[config.name];

            return (
              <div className="flex items-end gap-2" key={config.name}>
                {config.component === 'select' ? (
                  <FormSelect
                    name={`${name || 'temp'}_${config.name}` as any}
                    value={fieldValue}
                    label={config.label}
                    placeholder={config.placeholder}
                    onChange={(e: any) =>
                      handleInputChange(config.name, e.target.value)
                    }
                    errors={{} as any}
                    selectProps={config.inputProps as any}
                  >
                    <>
                      {config.selectOptions?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </>
                  </FormSelect>
                ) : (
                  <FormInput
                    name={`${name || 'temp'}_${config.name}` as any}
                    value={fieldValue}
                    label={config.label}
                    placeholder={config.placeholder}
                    type={config.type || 'text'}
                    onChange={(e: any) => {
                      const val =
                        typeof e === 'string' ? e : e?.target?.value || '';
                      handleInputChange(config.name, val);
                    }}
                    onKeyDown={handleKeyDown}
                    errors={{} as any}
                    maskProps={config.maskProps}
                    inputProps={config.inputProps}
                    noControl
                  />
                )}
                <div className="flex justify-end mt-2">
                  <PrimaryButton
                    className="h-10"
                    type="button"
                    onClick={() => handleAddItem(config.name)}
                  >
                    {addButtonText}
                  </PrimaryButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensagem de erro de validação */}
        {itemError && (
          <p className="text-red-500 text-sm font-medium">{itemError}</p>
        )}
      </div>

      {/* Lista de itens adicionados (chips) */}
      {!!value?.length && (
        <div className="flex flex-wrap gap-2 mt-4 px-2">
          {value.map((item, index) => (
            <div
              key={
                typeof item === 'object' && item.id !== undefined
                  ? item.id
                  : index
              }
              className="flex items-center bg-primary text-white text-sm px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="mr-2">{renderChipContent(item, index)}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-full p-0.5 transition-colors"
                aria-label={`Remover item ${index + 1}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem de erro se necessário para o array completo, se desejar implementar */}
    </Container>
  );
}

/**
 * Exemplo de uso do FormArrayInput em um componente pai com react-hook-form:
 *
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import { FormArrayInput } from './FormArrayInput';
 *
 * export function ExampleParentForm() {
 *   const { register, setValue, watch, handleSubmit } = useForm({
 *     defaultValues: { contatos: [] }
 *   });
 *   const contatos = watch("contatos");
 *
 *   // Atualiza o campo contatos com o novo array vindo do FormArrayInput
 *   const handleContatosChange = (newArray: string[]) => {
 *     setValue("contatos", newArray, { shouldValidate: true });
 *   };
 *
 *   const onSubmit = (data: any) => {
 *     console.log('Dados do formulário:', data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <FormArrayInput
 *         name="contatos"
 *         title="Contatos"
 *         addButtonText="+"
 *         ValuesArrayString
 *         value={contatos}
 *         onChange={handleContatosChange}
 *         fieldConfigs={[
 *           {
 *             name: "contato",
 *             label: "Contato",
 *             type: "text",
 *             required: true,
 *             maskProps: { mask: "(00) 000000000" },
 *             inputProps: { minLength: 8 }
 *           }
 *         ]}
 *         renderChipContent={(contato) => <span>{contato}</span>}
 *       />
 *       <button type="submit">Enviar</button>
 *     </form>
 *   );
 * }
 *
 */
