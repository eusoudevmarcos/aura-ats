// // src/controllers/VagaController.ts
// import { Request, Response } from "express";
// import { VagaService } from "../services/vaga.service";
// import { inject, injectable } from "tsyringe";

// @injectable()
// export class VagaController {
//   constructor(@inject(VagaService) private service: VagaService) {}

//   async create(req: Request, res: Response): Promise<Response> {
//     try {
//       const vagaData = req.body;
//       const newVaga = await this.service.save(vagaData);
//       return res.status(201).json(newVaga);
//     } catch (error: any) {
//       console.error("Error creating vaga:", error);
//       return res
//         .status(500)
//         .json({ message: "Internal server error", error: error.message });
//     }
//   }

//   async getAll(req: Request, res: Response): Promise<Response> {
//     try {
//       const vagas = await this.service.getAllVagas();
//       return res.status(200).json(vagas);
//     } catch (error: any) {
//       console.error("Error fetching vagas:", error);
//       return res
//         .status(500)
//         .json({ message: "Internal server error", error: error.message });
//     }
//   }

//   async getById(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params;
//     try {
//       const vaga = await this.service.getVagaById(id);
//       if (!vaga) {
//         return res.status(404).json({ message: "Vaga not found" });
//       }
//       return res.status(200).json(vaga);
//     } catch (error: any) {
//       console.error("Error fetching vaga by ID:", error);
//       return res
//         .status(500)
//         .json({ message: "Internal server error", error: error.message });
//     }
//   }

//   async delete(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params;
//     try {
//       const vaga = await this.service.deleteVaga(id);
//       return res.status(204).send(vaga);
//     } catch (error: any) {
//       console.error("Error deleting vaga:", error);
//       return res
//         .status(500)
//         .json({ message: "Internal server error", error: error.message });
//     }
//   }
// }
