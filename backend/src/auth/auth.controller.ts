import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PhoneAuthDto, PhoneVerificationDto, LoginResponseDto } from '../dto/auth.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar código de verificação por SMS' })
  @ApiResponse({ status: 200, description: 'Código enviado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async sendVerificationCode(@Body() phoneVerificationDto: PhoneVerificationDto) {
    return this.authService.sendVerificationCode(phoneVerificationDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar código e fazer login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Código inválido' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async verifyAndLogin(@Body() phoneAuthDto: PhoneAuthDto) {
    return this.authService.verifyAndLogin(phoneAuthDto);
  }
}
