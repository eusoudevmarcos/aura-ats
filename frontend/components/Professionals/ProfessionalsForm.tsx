import React, { useState } from 'react';
import { AREAS_DATA } from '@/data/AREAS_DATA';

interface FormData {
  area: string;
  profissao: string;
  especialidade: string;
}

const ProfessionalsForm = () => {
  const [formData, setFormData] = useState<FormData>({
    area: '',
    profissao: '',
    especialidade: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'area' && { profissao: '', especialidade: '' }),
      ...(name === 'profissao' && { especialidade: '' }),
    }));
  };

  // Tipagens corretas
  type AreaKey = keyof typeof AREAS_DATA;

  const areaKey = formData.area as AreaKey;

  const professions =
    areaKey && AREAS_DATA[areaKey]?.Profissões
      ? Object.keys(AREAS_DATA[areaKey].Profissões)
      : [];

  const profissoes =
    areaKey && AREAS_DATA[areaKey]?.Profissões
      ? AREAS_DATA[areaKey].Profissões
      : undefined;

  const specialties =
    profissoes &&
    formData.profissao &&
    formData.profissao in profissoes
      ? profissoes[formData.profissao as keyof typeof profissoes]
      : [];

  return (
    <form>
      {/* Campo Área */}
      <label>Área</label>
      <select name="area" value={formData.area} onChange={handleChange}>
        <option value="">Selecione a área</option>
        {Object.keys(AREAS_DATA).map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>

      {/* Campo Profissão */}
      {professions.length > 0 && (
        <>
          <label>Profissão</label>
          <select
            name="profissao"
            value={formData.profissao}
            onChange={handleChange}
          >
            <option value="">Selecione a profissão</option>
            {professions.map((prof) => (
              <option key={prof} value={prof}>
                {prof}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Campo Especialidade */}
      {specialties.length > 0 && (
        <>
          <label>Especialidade</label>
          <select
            name="especialidade"
            value={formData.especialidade}
            onChange={handleChange}
          >
            <option value="">Selecione a especialidade</option>
            {specialties.map((esp) => (
              <option key={esp} value={esp}>
                {esp}
              </option>
            ))}
          </select>
        </>
      )}
    </form>
  );
};

export default ProfessionalsForm;
