import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";
import { injectable } from "tsyringe";

type EmailOptions = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
  }>;
};

@injectable()
export class EmailService {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    this.defaultFrom =
      process.env.FROM_ADDRESS || user || "no-reply@example.com";

    if (!host || !user || !pass) {
      // transporter in "stub" mode: direct transport that fails if not configured.
      // Verify will throw if used without proper env.
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false,
        },
      });
    }
  }

  // Verifica conexão com o servidor SMTP (útil em startup)
  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (err) {
      console.error("EmailService verification failed:", err);
      return false;
    }
  }

  // Envia um email; retorna info do envio ou lança erro
  async sendMail(opts: EmailOptions): Promise<SentMessageInfo> {
    const mail = {
      from: opts.from || this.defaultFrom,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      attachments: opts.attachments,
    };

    try {
      const info = await this.transporter.sendMail(mail);
      return info;
    } catch (err) {
      console.error("EmailService sendMail error:", err);
      throw err;
    }
  }

  public async sendUsuarioSistemaEmail(
    cliente: any,
    usuarioSistemaData: any
  ): Promise<void> {
    try {
      // Configurar transporter de email (ajuste conforme sua configuração)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || "noreply@aura-ats.com",
        to: usuarioSistemaData.email,
        subject: "Bem-vindo ao Aura ATS - Suas credenciais de acesso",
        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Bem-vindo ao Aura ATS!</h2>
                <p>Olá,</p>
                <p>Seu cadastro foi realizado com sucesso! Aqui estão suas credenciais de acesso:</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Email:</strong> ${usuarioSistemaData.email}</p>
                  <p><strong>Senha:</strong> ${usuarioSistemaData.password}</p>
                </div>
                
                <p>Para acessar o sistema, clique no link abaixo:</p>
                <a href="${
                  process.env.FRONTEND_URL || "http://localhost:3000"
                }/login" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Acessar Sistema
                </a>
                
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                  <strong>Importante:</strong> Por segurança, recomendamos que você altere sua senha no primeiro acesso.
                </p>
                
                <p style="color: #666; font-size: 14px;">
                  Se você não solicitou este cadastro, ignore este email.
                </p>
              </div>
            `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email enviado com sucesso para:", usuarioSistemaData.email);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      // Não falha o processo se o email não for enviado
    }
  }
}

const emailService = new EmailService();
export default emailService;
