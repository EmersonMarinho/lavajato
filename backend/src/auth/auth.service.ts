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
      console.log('verifyAndLogin chamado com:', phoneAuthDto);
      
      // Em produção, aqui você verificaria o código com Firebase Auth
      // Por enquanto, vamos aceitar qualquer código para demonstração
      if (phoneAuthDto.verificationCode !== '123456') {
        console.log('Código inválido:', phoneAuthDto.verificationCode);
        throw new UnauthorizedException('Código de verificação inválido');
      }

      console.log('Código válido, buscando usuário:', phoneAuthDto.phoneNumber);
      
      // Buscar usuário pelo telefone
      let user = await this.prisma.user.findUnique({
        where: { telefone: phoneAuthDto.phoneNumber },
      }) as any;
      
      console.log('Usuário encontrado:', user);

      // Se não existir, criar usuário básico
      if (!user) {
        const createUserDto: CreateUserDto = {
          nome: 'Usuário',
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
      
      console.log('Verificando se precisa completar cadastro...');
      console.log('data_nascimento:', user.data_nascimento);
      console.log('tipo:', user.tipo);
      
      // Verificar se o usuário tem cadastro completo
      const needsCompleteRegistration = !user.data_nascimento || !user.tipo;
      
      console.log('needsCompleteRegistration:', needsCompleteRegistration);
      
      if (needsCompleteRegistration) {
        console.log('Retornando para completar cadastro');
        // Retornar informação de que precisa completar cadastro
        const payload = { sub: user.id, telefone: user.telefone };
        const accessToken = this.jwtService.sign(payload);
        
        return {
          needsCompleteRegistration: true,
          accessToken,
          user: {
            id: user.id,
            nome: user.nome,
            telefone: user.telefone,
            pontos_fidelidade: user.pontos_fidelidade,
          },
        };
      }

      // Cadastro completo, fazer login normalmente
      console.log('Cadastro completo, retornando token de acesso');
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
      console.error('Erro em verifyAndLogin:', error);
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

  async completeRegistration(userId: string, completeData: { nome: string; dataNascimento: string; tipo: string }): Promise<any> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          nome: completeData.nome,
          data_nascimento: new Date(completeData.dataNascimento),
          tipo: completeData.tipo,
        } as any,
      });

      return {
        accessToken: this.jwtService.sign({ sub: updatedUser.id, telefone: updatedUser.telefone }),
        user: {
          id: updatedUser.id,
          nome: updatedUser.nome,
          telefone: updatedUser.telefone,
          pontos_fidelidade: updatedUser.pontos_fidelidade,
        },
      };
    } catch (error) {
      throw new BadRequestException('Erro ao completar cadastro');
    }
  }
}
