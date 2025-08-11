import React from "react";
import { useFormContext } from "react-hook-form";

const ProfissionalSection: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const getError = (path: string): string | undefined => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = errors;
      for (const p of parts) obj = obj?.[p];
      return obj?.message as string | undefined;
    } catch {
      return undefined;
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
        Dados do Profissional
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="area"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Área Profissional:
          </label>
          <select
            id="area"
            {...register("area")}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="MEDICINA">Medicina</option>
            <option value="ENFERMAGEM">Enfermagem</option>
            <option value="OUTRO">Outro</option>
          </select>
          {getError("area") && (
            <p className="text-red-500 text-xs italic">{getError("area")}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="especialidadeId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Especialidade (opcional):
          </label>
          <select
            id="especialidadeId"
            {...register("especialidadeId", { valueAsNumber: true })}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Nenhuma</option>
            <option value={1}>Cardiologia</option>
            <option value={2}>Dermatologia</option>
            <option value={3}>Pediatria</option>
          </select>
          {getError("especialidadeId") && (
            <p className="text-red-500 text-xs italic">
              {getError("especialidadeId")}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="crm"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            CRM (para Medicina):
          </label>
          <input
            type="text"
            id="crm"
            {...register("crm")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {getError("crm") && (
            <p className="text-red-500 text-xs italic">{getError("crm")}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="corem"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            COREN (para Enfermagem):
          </label>
          <input
            type="text"
            id="corem"
            {...register("corem")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {getError("corem") && (
            <p className="text-red-500 text-xs italic">{getError("corem")}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="rqe"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            RQE (Opcional):
          </label>
          <input
            type="text"
            id="rqe"
            {...register("rqe")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {getError("rqe") && (
            <p className="text-red-500 text-xs italic">{getError("rqe")}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfissionalSection;
