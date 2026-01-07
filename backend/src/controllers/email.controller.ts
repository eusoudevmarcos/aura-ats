import { inject, injectable } from "tsyringe";
import { Controller, Get } from "routing-controllers";
import { EmailService } from "../services/email.service";

@injectable()
@Controller("/email")
export class EmailController {
  constructor(@inject(EmailService) private emailService: EmailService) {}

  @Get("/verify")
  async verify() {
    const isVerify = await this.emailService.verify();
    return {
      success: isVerify,
      message: isVerify ? "Email sent successfully" : "Failed to send email",
    };
  }
}
