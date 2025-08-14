import React from "react";
import { UseFormReturn, FormProvider, FieldValues } from "react-hook-form";
import {
  AreaCandidatoEnum,
  CandidatoInput,
  candidatoSchema,
} from "@/schemas/candidato.schema";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { FormInput } from "@/components/input/FormInput";
import { FormSelect } from "@/components/input/FormSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import PessoaForm from "./PessoaForm";

type CandidatoFormProps<T extends FieldValues> = {
  namePrefix?: string;
  formContexto?: UseFormReturn<T>;
  onSubmit?: (data: any) => void;
};

const CandidatoForm = ({
  namePrefix = "candidato",
  onSubmit,
}: CandidatoFormProps<any>) => {
  const mode = "context";

  const methods = useSafeForm({
    debug: true,
    useFormProps: { resolver: zodResolver(candidatoSchema) },
    mode,
  });

  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = methods;

  const areaCandidatoName = makeName<CandidatoInput>(
    namePrefix,
    "areaCandidato"
  );
  const crm = makeName<CandidatoInput>(namePrefix, "crm");
  const corem = makeName<CandidatoInput>(namePrefix, "corem");
  const rqe = makeName<CandidatoInput>(namePrefix, "rqe");
  const especialidadeNome = makeName<CandidatoInput>(
    namePrefix,
    "especialidade.nome"
  );
  const especialidadeSigla = makeName<CandidatoInput>(
    namePrefix,
    "especialidade.sigla"
  );
  const formacaoMedicina = makeName<CandidatoInput>(
    namePrefix,
    "formacoes[0].dataConclusaoMedicina"
  );
  const formacaoResidencia = makeName<CandidatoInput>(
    namePrefix,
    "formacoes[1].dataConclusaoResidencia"
  );

  const handleAreaCandidatoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValue(areaCandidatoName, e.target.value);
  };

  const submitHandler = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const formContent = (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <FormSelect
        name={areaCandidatoName}
        label="Área do Candidato"
        value={areaCandidatoName || ""}
        onChange={handleAreaCandidatoChange}
        required
        selectProps={{
          classNameContainer: "px-4",
          children: (
            <>
              <option value="">Selecione uma área</option>
              {Object.values(AreaCandidatoEnum).map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </>
          ),
        }}
        errors={errors}
      />

      <FormInput
        name={crm}
        register={register}
        placeholder="CRM"
        errors={errors}
      />

      <FormInput
        name={corem}
        register={register}
        placeholder="COREN"
        errors={errors}
      />

      <FormInput
        name={rqe}
        register={register}
        placeholder="RQE"
        errors={errors}
      />

      <div className="col-span-full" title="Especialidade">
        <h3 className="text-xl font-bold">Especialidade</h3>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormInput
            name={especialidadeNome}
            register={register}
            placeholder="Nome da Especialidade"
            errors={errors}
          />
          <FormInput
            name={especialidadeSigla}
            register={register}
            placeholder="Sigla da Especialidade"
            errors={errors}
          />
        </section>
      </div>

      <div className="col-span-full" title="Dados Pessoais">
        <h3 className="text-xl font-bold">Dados Pessoais</h3>
        <PessoaForm namePrefix={`${namePrefix}.pessoa`} />
      </div>

      <div className="col-span-full" title="Formação Acadêmica">
        <h3 className="text-xl font-bold">Formação Acadêmica</h3>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormInput
            name={formacaoMedicina}
            control={control}
            placeholder="Data de Conclusão da Medicina"
            errors={errors}
            type="date"
          />
          <FormInput
            name={formacaoResidencia}
            control={control}
            placeholder="Data de Conclusão da Residência"
            errors={errors}
            type="date"
          />
        </section>
      </div>
    </section>
  );

  if (mode !== "context") {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          {formContent}
          <button type="submit">Salvar Candidato</button>
        </form>
      </FormProvider>
    );
  }

  return formContent;
};

export default CandidatoForm;
