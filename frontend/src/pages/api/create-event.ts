// pages/api/create-event.ts
import { CreateEventRequestBody } from '@/type/calendar.type';
import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const token = await getToken({ req, secret });

  if (!token || !token.accessToken) {
    return res
      .status(401)
      .json({ message: 'Não autenticado ou token inválido.' });
  }

  const { summary, description, start, end } =
    req.body as CreateEventRequestBody;

  if (!summary || !start || !end) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
  }

  try {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: token.sub });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: 'America/Sao_Paulo', // Ajuste para o seu fuso horário
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: 'America/Sao_Paulo', // Ajuste para o seu fuso horário
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    res.status(200).json({
      message: 'Evento criado com sucesso!',
      event: response.data,
    });
  } catch (error: any) {
    console.error('Erro ao criar evento:', error.message);
    res.status(500).json({
      message: 'Erro interno ao criar o evento.',
      error: error.message,
    });
  }
}
