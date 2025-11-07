import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
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
}

interface FormArrayInputProps {
  name: any; 
  title: string; 
  addButtonText: string;
  fieldConfigs: FieldConfig[];
  renderChipContent: (item: any, index: any) => React.ReactNode;
  initialItemData?: any;
}

export function FormArrayInput({
  name,
  title,
  addButtonText,
  fieldConfigs,
  renderChipContent,
  initialItemData = {},
}: FormArrayInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: name,
  });

  const [newItemValues, setNewItemValues] = useState<any>(initialItemData);
  const [itemError, setItemError] = useState<string | null>(null);

  const handleInputChange = (fieldName: string, value: any) => {
    setNewItemValues((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleAddItem = () => {
    for (const config of fieldConfigs) {
      if (
        config.required &&
        (!newItemValues[config.name] ||
          String(newItemValues[config.name]).trim() === '')
      ) {
        setItemError(`O campo '${config.label}' é obrigatório.`);
        return;
      }
    }

    setItemError(null);
    append(newItemValues);
    setNewItemValues(initialItemData);
  };

  return (
    <Container
      label={title}
      className="border border-primary p-4 rounded-lg shadow-sm"
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-${fieldConfigs.length} gap-4 mb-4 `}
      >
        {fieldConfigs.map(config => (
          <React.Fragment key={config.name}>
            {config.component === 'select' ? (
              <FormSelect
                name={`_temp_${name}.${config.name}`}
                label={config.label}
                placeholder={config.placeholder}
                value={newItemValues[config.name]}
                onChange={(e: any) =>
                  handleInputChange(config.name, e.target.value)
                }
                errors={errors as any}
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
                name={`_temp_${name}.${config.name}`}
                label={config.label}
                placeholder={config.placeholder}
                type={config.type}
                value={newItemValues[config.name]}
                onChange={(e: any) =>
                  handleInputChange(config.name, e.target.value)
                }
                errors={errors as any}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {itemError && (
        <p className="text-red-500 text-xs italic mb-2">{itemError}</p>
      )}

      <div className="flex justify-end mb-4">
        <PrimaryButton type="button" onClick={handleAddItem}>
          {addButtonText}
        </PrimaryButton>
      </div>

      {fields.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 p-2 border rounded-md bg-gray-50">
          {fields.map((item: any, index: any) => (
            <div
              key={item.id || index}
              className="flex items-center bg-primary text-white text-sm px-3 py-1 rounded-full shadow-md"
            >
              {renderChipContent(item, index)}
              <button
                type="button"
                onClick={() => remove(index)}
                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
              >
                <span>x</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {errors[name] && (
        <p className="text-red-500 text-xs italic mt-1">
          {(errors[name] as any)?.message as string}
        </p>
      )}
    </Container>
  );
}
