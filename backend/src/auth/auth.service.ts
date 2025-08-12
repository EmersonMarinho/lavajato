import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PhoneAuthDto, PhoneVerificationDto } from '../dto/auth.dto';
import { CreateUserDto } from '../dto/user.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Inicializar Firebase Admin se ainda não foi inicializado
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }

  async sendVerificationCode(phoneVerificationDto: PhoneVerificationDto): Promise<{ message: string }> {
    try {
      // Em produção, aqui você integraria com um serviço de SMS
      // Por enquanto, vamos simular o envio
      console.log(`Código de verificação enviado para ${phoneVerificationDto.phoneNumber}`);
      
      return { message: 'Código de verificação enviado com sucesso' };
    } catch (error) {
      throw new BadRequestException('Erro ao enviar código de verificação');
    }
  }

  async verifyAndLogin(phoneAuthDto: PhoneAuthDto): Promise<any> {
    try {
      // Em produção, aqui você verificaria o código com Firebase Auth
      // Por enquanto, vamos aceitar qualquer código para demonstração
      if (phoneAuthDto.verificationCode !== '123456') {
        throw new UnauthorizedException('Código de verificação inválido');
      }

      // Buscar usuário pelo telefone
      let user = await this.prisma.user.findUnique({
        where: { telefone: phoneAuthDto.phoneNumber },
      });

      // Se não existir, criar novo usuário
      if (!user) {
        const createUserDto: CreateUserDto = {
          nome: `Usuário ${phoneAuthDto.phoneNumber.slice(-4)}`,
          telefone: phoneAuthDto.phoneNumber,
          endereco: 'Endereço não informado',
          bairro: 'Bairro não informado',
          cidade: 'Cidade não informada',
          estado: 'UF',
          cep: '00000-000',
          pontos_fidelidade: 0,
        };

        user = await this.prisma.user.create({
          data: createUserDto,
        });
      }

      // Gerar token JWT
      const payload = { sub: user.id, telefone: user.telefone };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: {
          id: user.id,
          nome: user.nome,
          telefone: user.telefone,
          pontos_fidelidade: user.pontos_fidelidade,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Erro na autenticação');
    }
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
}
