import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({ description: 'Nome da unidade' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Endereço da unidade' })
  @IsString()
  @IsNotEmpty()
  endereco: string;
}

export class UpdateUnitDto {
  @ApiProperty({ description: 'Nome da unidade' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ApiProperty({ description: 'Endereço da unidade' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endereco?: string;
}

export class UnitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  endereco: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
