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
}
