import { z } from 'zod';

export const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Número de telefone deve ter pelo menos 10 dígitos'),
  verificationCode: z.string().min(6, 'Código deve ter pelo menos 6 dígitos'),
});

export const createUnitSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  endereco: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres'),
});

export const updateUnitSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  endereco: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres').optional(),
});

export const createServiceSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  preco_base: z.number().min(0, 'Preço base deve ser maior ou igual a 0'),
  adicional_por_porte: z.number().min(0, 'Adicional por porte deve ser maior ou igual a 0'),
});

export const updateServiceSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  preco_base: z.number().min(0, 'Preço base deve ser maior ou igual a 0').optional(),
  adicional_por_porte: z.number().min(0, 'Adicional por porte deve ser maior ou igual a 0').optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO']).optional(),
  data: z.string().optional(),
  hora: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUnitFormData = z.infer<typeof createUnitSchema>;
export type UpdateUnitFormData = z.infer<typeof updateUnitSchema>;
export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;
export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>;
