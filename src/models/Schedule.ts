export interface Schedule {
  id?: string;
  professionalId: string;
  interviewId: string;
  clientId: string;
  jobId: string;
  date: Date;
  status?: string; // Exemplo: 'pendente', 'confirmada', 'cancelada'
}

