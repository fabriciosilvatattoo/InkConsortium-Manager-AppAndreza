export enum EditionStatus {
  ACTIVE = 'Ativa',
  FINISHED = 'Finalizada',
  PAUSED = 'Pausada'
}

export enum UserRole {
  ADMIN = 'Admin',
  PARTICIPANT = 'Participante'
}

export enum CotaStatus {
  ACTIVE = 'Ativa',
  INACTIVE = 'Inativa', // Desistente
  QUITADA = 'Quitada'
}

export enum PaymentStatus {
  PENDING = 'Pendente',
  VALIDATING = 'Validando', // Aguardando aprovação do admin
  PAID = 'Pago',
  LATE = 'Atrasado'
}

export interface Edition {
  id: string;
  name: string;
  totalValue: number;
  installmentValue: number;
  totalInstallments: number;
  dueDay: number;
  startDate: string; // ISO Date
  status: EditionStatus;
}

export interface Participant {
  id: string;
  name: string;
  whatsapp: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Cota {
  id: string;
  participantId: string;
  editionId: string;
  contemplated: boolean;
  contemplationMonth?: string;
  status: CotaStatus;
  number: number; // Cota number ex: 01
}

export interface Payment {
  id: string;
  cotaId: string;
  installmentNumber: number; // 1 to 12
  value: number;
  dueDate: string; // ISO Date
  paidDate?: string; // ISO Date
  proofUrl?: string;
  status: PaymentStatus;
}

export interface DrawHistory {
  id: string;
  editionId: string;
  cotaId: string;
  drawDate: string; // ISO Date
  monthRef: string; // e.g., "Agosto/2024"
}

// App State Context
export interface AppState {
  currentUser: Participant | null;
  currentView: 'LOGIN' | 'DASHBOARD';
}