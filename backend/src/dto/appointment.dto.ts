import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  AGENDADO = 'AGENDADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
}

export enum Porte {
  PEQUENO = 'PEQUENO',
  MEDIO = 'MEDIO',
  GRANDE = 'GRANDE',
}

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'ID do carro' })
  @IsString()
  @IsNotEmpty()
  car_id: string;

  @ApiProperty({ description: 'ID da unidade' })
  @IsString()
  @IsNotEmpty()
  unit_id: string;

  @ApiProperty({ description: 'Data do agendamento' })
  @IsDateString()
  data: string;

  @ApiProperty({ description: 'Hora do agendamento' })
  @IsString()
  @IsNotEmpty()
  hora: string;

  @ApiProperty({ description: 'IDs dos serviços selecionados' })
  @IsArray()
  @IsString({ each: true })
  service_ids: string[];

  @ApiProperty({ description: 'Inclui serviço de busca e entrega', default: false })
  @IsOptional()
  inclui_busca_entrega?: boolean;

  @ApiProperty({ description: 'Endereço específico para busca (opcional)' })
  @IsOptional()
  @IsString()
  endereco_busca?: string;

  @ApiProperty({ description: 'Observações para busca/entrega' })
  @IsOptional()
  @IsString()
  observacoes_busca?: string;
}

export class UpdateAppointmentDto {
  @ApiProperty({ description: 'Status do agendamento', enum: Status })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({ description: 'Data do agendamento' })
  @IsOptional()
  @IsDateString()
  data?: string;

  @ApiProperty({ description: 'Hora do agendamento' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  hora?: string;

  @ApiProperty({ description: 'Inclui serviço de busca e entrega' })
  @IsOptional()
  inclui_busca_entrega?: boolean;

  @ApiProperty({ description: 'Custo do serviço de busca e entrega' })
  @IsOptional()
  @IsNumber()
  custo_busca_entrega?: number;

  @ApiProperty({ description: 'Endereço específico para busca' })
  @IsOptional()
  @IsString()
  endereco_busca?: string;

  @ApiProperty({ description: 'Observações para busca/entrega' })
  @IsOptional()
  @IsString()
  observacoes_busca?: string;
}

export class AppointmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  car_id: string;

  @ApiProperty()
  unit_id: string;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty()
  data: Date;

  @ApiProperty()
  hora: string;

  @ApiProperty()
  preco_final: number;

  @ApiProperty()
  inclui_busca_entrega: boolean;

  @ApiProperty()
  custo_busca_entrega: number;

  @ApiProperty()
  endereco_busca?: string;

  @ApiProperty()
  observacoes_busca?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [String] })
  service_ids: string[];
}

export class PriceCalculationDto {
  @ApiProperty({ description: 'Porte do carro', enum: Porte })
  @IsString()
  @IsNotEmpty()
  porte: Porte;

  @ApiProperty({ description: 'IDs dos serviços' })
  @IsArray()
  @IsString({ each: true })
  service_ids: string[];
}

export class PriceCalculationResponseDto {
  @ApiProperty({ description: 'Preço base total' })
  preco_base_total: number;

  @ApiProperty({ description: 'Adicional por porte' })
  adicional_porte: number;

  @ApiProperty({ description: 'Preço final' })
  preco_final: number;

  @ApiProperty({ description: 'Detalhamento dos serviços' })
  servicos: Array<{
    id: string;
    nome: string;
    preco_base: number;
    adicional_porte: number;
  }>;
}
