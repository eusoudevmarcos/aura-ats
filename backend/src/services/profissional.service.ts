import { injectable, inject } from "tsyringe";
import { MedicoInput, ProfissionalModel } from "../models/profissional.model";

@injectable()
export default class ProfissionalService {
  constructor(
    @inject(ProfissionalModel) private profissionalModel: ProfissionalModel
  ) {}

  async create(data: Omit<MedicoInput, "id">) {
    return await this.profissionalModel.create(data);
  }

  async get(id: string) {
    return await this.profissionalModel.getOne(id);
  }
  /*
  async update(id: string, data: MedicoInput) {
    return await this.medicoModel.update(id, data);
  }

  async delete(id: string) {
    return await this.medicoModel.delete(id);
  }*/
}
