import {
  StatusClienteEnum,
  StatusClienteEnumInput,
} from '@/schemas/statusClienteEnum.schema';
import { StatusVagaEnum } from '@/schemas/vaga.schema';
import { LabelController } from './LabelController';

export const LabelStatus = ({
  status,
}: {
  status: StatusClienteEnumInput | StatusVagaEnum;
}) => {
  let statusBgColor = 'bg-[#ede9fe]';

  switch (status) {
    case StatusClienteEnum.enum.ATIVO:
      statusBgColor = 'bg-green-500 text-white';
      break;
    case StatusVagaEnum.enum.ATIVA:
      statusBgColor = 'bg-green-500 text-white';
      break;
    case StatusClienteEnum.enum.INATIVO:
      statusBgColor = 'bg-red-500 text-secondary';
      break;
    case StatusClienteEnum.enum.LEAD:
      statusBgColor = 'bg-cyan-500 text-white';
      break;
    case StatusClienteEnum.enum.PROSPECT:
      statusBgColor = 'bg-gray-500 text-white';
      break;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <LabelController
        label="Status:"
        value={
          <span
            className={`${statusBgColor} text-xs font-semibold px-3 py-1 rounded-full`}
          >
            {status}
          </span>
        }
      />
    </div>
  );
};
