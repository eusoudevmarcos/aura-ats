// src/components/form/FormArrayInput.tsx
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormInput } from "../input/FormInput";
import { FormSelect } from "../input/FormSelect";
import { PrimaryButton } from "../button/PrimaryButton";

// Definição genérica para a configuração de cada campo do item
interface FieldConfig {
  name: string; // Nome interno para o campo do item (ex: 'nome', 'descricao', 'tipoHabilidade')
  label: string;
  placeholder?: string;
  type?: string; // ex: 'text', 'number', 'date'
  component?: "input" | "select"; // Para decidir qual componente usar
  selectOptions?: { value: any; label: string }[]; // Para componentes select
  required?: boolean; // Adicionar flag de obrigatoriedade
}

interface FormArrayInputProps {
  name: any; // O nome do array no seu formulário (ex: "habilidades", "beneficios")
  title: string; // Título da seção (ex: "Habilidades", "Benefícios")
  addButtonText: string; // Texto do botão para adicionar
  fieldConfigs: FieldConfig[]; // Configuração dos campos para cada item do array
  renderChipContent: (item: any, index: any) => React.ReactNode; // Função para renderizar o conteúdo do chip
  initialItemData?: any; // Dados iniciais para um novo item, se necessário
  // REMOVIDO: register: any; // Este prop não é necessário aqui, pois FormArrayInput usa useFormContext e inputs internos são controlados pelo estado local
}

export function FormArrayInput({
  name,
  title,
  addButtonText,
  fieldConfigs,
  renderChipContent,
  initialItemData = {}, // Define um objeto vazio como padrão
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
          String(newItemValues[config.name]).trim() === "")
      ) {
        setItemError(`O campo '${config.label}' é obrigatório.`);
        return;
      }
    }

    setItemError(null);
    append(newItemValues); // Adiciona o novo item ao array do form
    setNewItemValues(initialItemData); // Reseta os campos para o próximo item
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      <div
        className={`grid grid-cols-1 md:grid-cols-${fieldConfigs.length} gap-4 mb-4`}
      >
        {fieldConfigs.map((config) => (
          <React.Fragment key={config.name}>
            {config.component === "select" ? (
              <FormSelect
                name={`_temp_${name}.${config.name}`} // Nome fictício para controle de estado local
                label={config.label}
                placeholder={config.placeholder}
                value={newItemValues[config.name]}
                onChange={(e: any) =>
                  handleInputChange(config.name, e.target.value)
                }
                errors={errors as any}
                selectProps={{
                  children: (
                    <>
                      <option value="">
                        {config.placeholder || `Selecione ${config.label}`}
                      </option>
                      {config.selectOptions?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </>
                  ),
                }}
              />
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
              className="flex items-center bg-[#8c53ff] text-white text-sm px-3 py-1 rounded-full shadow-md"
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
    </div>
  );
}
