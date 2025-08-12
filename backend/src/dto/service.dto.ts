import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ description: 'Nome do serviço' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Preço base do serviço' })
  @IsNumber()
  @Min(0)
  preco_base: number;

  @ApiProperty({ description: 'Adicional por porte do carro' })
  @IsNumber()
  @Min(0)
  adicional_por_porte: number;
}

export class UpdateServiceDto {
  @ApiProperty({ description: 'Nome do serviço' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ApiProperty({ description: 'Preço base do serviço' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preco_base?: number;

  @ApiProperty({ description: 'Adicional por porte do carro' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  adicional_por_porte?: number;
}

export class ServiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  preco_base: number;

  @ApiProperty()
  adicional_por_porte: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
