
// FIX: Import `ReactNode` from 'react' and use it for the 'icon' property in `ServiceTopic` to resolve the 'Cannot find namespace JSX' error.
import type { ReactNode } from 'react';

export interface Lawyer {
  lawyer_id: string; // UUID in DB
  nome: string;
  especialidade: string;
  avatarUrl: string;
  phoneNumber?: string;
  oamNumber?: string;
  isOnline?: boolean;
  rating?: number; // Average rating
  totalReviews?: number;
}

export interface LawyerStats {
  dailyConsultations: number;
  dailyRevenue: number;
}

export interface ServiceTopic {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface ConsultationPackage {
  id: string;
  name: string;
  type: 'consultation' | 'follow_up'; // Distinguished types
  duration?: number;
  unit?: 'minutes' | 'monthly' | 'fixed_fee';
  price: number; // in MZN
  description: string;
}

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PENDING_ASSIGNMENT = 'pending_assignment',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  RATING_PENDING = 'rating_pending',
  CANCELLED = 'cancelled',
}

export type ConsultationType = 'digital' | 'phone';

export interface Order {
  id: string; // UUID primary key
  human_id: string; // Display ID (FC-XXXX)
  order_id: string; // Legacy alias for human_id to minimize refactor
  parent_order_id?: string; // UUID of parent
  user_id: string;
  clientPhoneNumber?: string; // Number used for M-Pesa payment
  topic: ServiceTopic;
  pkg: ConsultationPackage;
  consultationType: ConsultationType;
  payment_status: 'pending' | 'confirmed' | 'failed';
  payment_method?: 'mpesa';
  transaction_reference?: string; // M-Pesa Transaction ID
  status: OrderStatus | string; // Allow string for DB mapping
  assignment?: Assignment;
  createdAt: Date;
  termsAccepted?: boolean; // For follow-ups
}

export interface Assignment {
  assignment_id: string;
  lawyer: Lawyer;
  assignedAt: Date;
  session?: Session;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'lawyer'; // mapped from sender_id comparisons
  sender_id?: string; // raw DB id
  text: string;
  timestamp: Date;
  type: 'text' | 'document';
  document?: Document;
}

export interface Document {
  document_id: string;
  filename: string;
  url: string;
  uploadedAt: Date;
}

export interface Session {
  session_id: string;
  startTime: Date;
  messages: ChatMessage[];
  documents: Document[];
}

export interface Rating {
  order_id: string;
  lawyer_id: string;
  stars: number;
  comment: string;
  createdAt: Date;
}

// User Registration Types
export enum DocumentType {
  BI = 'bi',
  PASSAPORTE = 'passaporte',
  CARTA_CONDUCAO = 'carta_conducao',
}

export interface User {
  id: string; // UUID
  // Dados Pessoais
  fullName: string;
  birthDate: Date;
  nationality: string;
  gender?: 'masculino' | 'feminino' | 'outro';

  // Identificação
  documentType: DocumentType;
  documentNumber: string;

  // Contato
  phoneNumber: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  address?: {
    neighborhood?: string;
    city?: string;
    country: string;
  };

  // Segurança
  passwordHash: string; // Never store plain passwords
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface RegistrationData {
  // Step 1: Dados Pessoais
  fullName?: string;
  birthDate?: Date;
  nationality?: string;
  gender?: 'masculino' | 'feminino' | 'outro';

  // Step 2: Identificação
  documentType?: DocumentType;
  documentNumber?: string;

  // Step 3: Contato
  phoneNumber?: string;
  phoneVerified?: boolean;
  phoneOtpCode?: string;
  email?: string;
  emailVerified?: boolean;
  emailVerificationCode?: string;
  neighborhood?: string;
  city?: string;
  country?: string;

  // Step 4: Segurança
  password?: string;
  confirmPassword?: string;
  twoFactorEnabled?: boolean;

  // Quick Registration Flag
  isQuickRegistration?: boolean; // If true, only basic info provided
  userId?: string; // ID retornado após registro no backend
}

