import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneAuthDto {
  @ApiProperty({ description: 'Número de telefone do usuário' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Código de verificação SMS' })
  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}

export class PhoneVerificationDto {
  @ApiProperty({ description: 'Número de telefone para verificação' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  accessToken: string;

  @ApiProperty({ description: 'Informações do usuário' })
  user: {
    id: string;
    nome: string;
    telefone: string;
    pontos_fidelidade: number;
  };
}
