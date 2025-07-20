export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string; // Opcional, pois pode ser gerenciado pelo Firebase Auth
  role: 'admin' | 'client' | 'professional' | 'employee'; // Tipos de usuário
  createdAt?: Date;
  updatedAt?: Date;
}