import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';
import { CreateEnderecoFavoritoDto, EnderecoFavoritoResponseDto } from '../dto/endereco-favorito.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UserResponseDto] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário', type: UserResponseDto })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Endereços Favoritos
  @Post(':id/enderecos-favoritos')
  @ApiOperation({ summary: 'Criar endereço favorito' })
  @ApiResponse({ status: 201, description: 'Endereço favorito criado com sucesso', type: EnderecoFavoritoResponseDto })
  createEnderecoFavorito(@Param('id') userId: string, @Body() createDto: CreateEnderecoFavoritoDto) {
    return this.usersService.createEnderecoFavorito(userId, createDto);
  }

  @Get(':id/enderecos-favoritos')
  @ApiOperation({ summary: 'Listar endereços favoritos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de endereços favoritos', type: [EnderecoFavoritoResponseDto] })
  getEnderecosFavoritos(@Param('id') userId: string) {
    return this.usersService.getEnderecosFavoritos(userId);
  }

  @Delete(':id/enderecos-favoritos/:enderecoId')
  @ApiOperation({ summary: 'Remover endereço favorito' })
  @ApiResponse({ status: 200, description: 'Endereço favorito removido com sucesso' })
  deleteEnderecoFavorito(@Param('id') userId: string, @Param('enderecoId') enderecoId: string) {
    return this.usersService.deleteEnderecoFavorito(userId, enderecoId);
  }
}
