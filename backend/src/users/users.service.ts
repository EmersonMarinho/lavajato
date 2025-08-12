import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar se o telefone já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { telefone: createUserDto.telefone },
    });

    if (existingUser) {
      throw new BadRequestException('Telefone já cadastrado');
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return user;
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByPhone(telefone: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { telefone },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Verificar se o usuário existe
    await this.findOne(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return user;
  }

  async remove(id: string): Promise<void> {
    // Verificar se o usuário existe
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async addPoints(id: string, points: number): Promise<UserResponseDto> {
    const user = await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        pontos_fidelidade: user.pontos_fidelidade + points,
      },
    });

    return updatedUser;
  }
}
