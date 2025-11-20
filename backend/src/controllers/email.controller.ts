import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { EmailService } from "../services/email.service";

@injectable()
export class EmailController {
  constructor(@inject(EmailService) private emailService: EmailService) {}

  public async verify(req: Request, res: Response): Promise<Response> {
    try {
      const isVerify = await this.emailService.verify();

      return res.status(200).json({
        success: isVerify,
        message: isVerify ? "Email sent successfully" : "Failed to send email",
      });
    } catch (error: Error | any) {
      console.log("EmailController verify error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: error?.message,
      });
    }
  }
}
