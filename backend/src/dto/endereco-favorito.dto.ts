import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnderecoFavoritoDto {
  @ApiProperty({ description: 'Nome do endereço (ex: Casa, Trabalho)' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Rua' })
  @IsString()
  @IsNotEmpty()
  rua: string;

  @ApiProperty({ description: 'Número' })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({ description: 'Complemento', required: false })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({ description: 'Bairro' })
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty({ description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({ description: 'CEP' })
  @IsString()
  @IsNotEmpty()
  cep: string;
}

export class EnderecoFavoritoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  rua: string;

  @ApiProperty()
  numero: string;

  @ApiProperty()
  complemento?: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

