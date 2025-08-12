import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Porte {
  PEQUENO = 'PEQUENO',
  MEDIO = 'MEDIO',
  GRANDE = 'GRANDE',
}

export class CreateCarDto {
  @ApiProperty({ description: 'ID do usuário proprietário' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Modelo do carro' })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({ description: 'Placa do carro' })
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiProperty({ description: 'Porte do carro', enum: Porte })
  @IsEnum(Porte)
  porte: Porte;
}

export class UpdateCarDto {
  @ApiProperty({ description: 'Modelo do carro' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  modelo?: string;

  @ApiProperty({ description: 'Placa do carro' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  placa?: string;

  @ApiProperty({ description: 'Porte do carro', enum: Porte })
  @IsOptional()
  @IsEnum(Porte)
  porte?: Porte;
}

export class CarResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  modelo: string;

  @ApiProperty()
  placa: string;

  @ApiProperty({ enum: Porte })
  porte: Porte;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
