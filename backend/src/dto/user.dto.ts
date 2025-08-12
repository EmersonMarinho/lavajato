import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Número de telefone' })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({ description: 'Endereço completo' })
  @IsString()
  @IsNotEmpty()
  endereco: string;

  @ApiProperty({ description: 'Bairro' })
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty({ description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({ description: 'Estado (UF)' })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ description: 'CEP' })
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ApiProperty({ description: 'Pontos de fidelidade', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  pontos_fidelidade?: number;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ApiProperty({ description: 'Endereço completo' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endereco?: string;

  @ApiProperty({ description: 'Bairro' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bairro?: string;

  @ApiProperty({ description: 'Cidade' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cidade?: string;

  @ApiProperty({ description: 'Estado (UF)' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  estado?: string;

  @ApiProperty({ description: 'CEP' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cep?: string;

  @ApiProperty({ description: 'Pontos de fidelidade' })
  @IsOptional()
  @IsInt()
  @Min(0)
  pontos_fidelidade?: number;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  endereco: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  pontos_fidelidade: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
