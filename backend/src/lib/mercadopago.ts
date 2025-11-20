import { MercadoPagoConfig, Payment } from "mercadopago";

// Configuração do cliente
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  },
});

const payment = new Payment(client);

interface CreatePixPaymentParams {
  amount: number;
  email: string;
  externalReference: string;
  description?: string;
  firstName?: string;
  lastName?: string;
  cpf?: string;
}

/**
 * Cria um pagamento PIX
 * @param params - Parâmetros do pagamento
 * @returns Promise com os dados do pagamento criado
 */
async function createPixPayment(params: CreatePixPaymentParams) {
  try {
    const body = {
      transaction_amount: params.amount,
      description: params.description || "Pagamento via PIX",
      payment_method_id: "pix",
      payer: {
        email: params.email,
        ...(params.firstName && {
          first_name: params.firstName,
        }),
        ...(params.lastName && {
          last_name: params.lastName,
        }),
        ...(params.cpf && {
          identification: {
            type: "CPF",
            number: params.cpf,
          },
        }),
      },
      external_reference: params.externalReference,
    };

    const requestOptions = {
      idempotencyKey: `${params.externalReference}-${Date.now()}`,
    };

    const response = await payment.create({ body, requestOptions });

    return {
      id: response.id,
      status: response.status,
      qrCode: response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,
      ticketUrl: response.point_of_interaction?.transaction_data?.ticket_url,
      externalReference: response.external_reference,
    };
  } catch (error) {
    console.log("Erro ao criar pagamento PIX:", error);
    throw error;
  }
}

// Exemplo de uso
async function exemploUso() {
  try {
    const resultado = await createPixPayment({
      amount: 100.5,
      email: "cliente@example.com",
      externalReference: "pedido-12345",
      description: "Compra de produtos",
      firstName: "João",
      lastName: "Silva",
      cpf: "12345678900",
    });

    console.log("Pagamento criado com sucesso!");
    console.log("ID do pagamento:", resultado.id);
    console.log("Status:", resultado.status);
    console.log("QR Code (copiar e colar):", resultado.qrCode);
    console.log("QR Code Base64:", resultado.qrCodeBase64);
    console.log("URL do ticket:", resultado.ticketUrl);

    // Para exibir o QR Code no frontend, use:
    // <img src={`data:image/png;base64,${resultado.qrCodeBase64}`} />
    return resultado;
  } catch (error) {
    console.log("Erro:", error);
  }
}

// Descomentar para testar
// exemploUso();

export { createPixPayment, CreatePixPaymentParams };
