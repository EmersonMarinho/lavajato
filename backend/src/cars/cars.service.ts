import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto, UpdateCarDto, CarResponseDto, Porte } from '../dto/car.dto';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarDto: CreateCarDto): Promise<CarResponseDto> {
    // Verificar se a placa já existe
    const existingCar = await this.prisma.car.findUnique({
      where: { placa: createCarDto.placa },
    });

    if (existingCar) {
      throw new BadRequestException('Placa já cadastrada');
    }

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createCarDto.user_id },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const car = await this.prisma.car.create({
      data: createCarDto,
    });

    return {
      ...car,
      porte: car.porte as Porte,
    };
  }

  async findAll(): Promise<CarResponseDto[]> {
    const cars = await this.prisma.car.findMany({
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cars.map(car => ({
      ...car,
      porte: car.porte as Porte,
    }));
  }

  async findByUser(userId: string): Promise<CarResponseDto[]> {
    const cars = await this.prisma.car.findMany({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cars.map(car => ({
      ...car,
      porte: car.porte as Porte,
    }));
  }

  async findOne(id: string): Promise<CarResponseDto> {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        },
      },
    });

    if (!car) {
      throw new NotFoundException('Carro não encontrado');
    }

    return {
      ...car,
      porte: car.porte as Porte,
    };
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<CarResponseDto> {
    // Verificar se o carro existe
    await this.findOne(id);

    // Se estiver atualizando a placa, verificar se já existe
    if (updateCarDto.placa) {
      const existingCar = await this.prisma.car.findFirst({
        where: {
          placa: updateCarDto.placa,
          id: { not: id },
        },
      });

      if (existingCar) {
        throw new BadRequestException('Placa já cadastrada');
      }
    }

    const car = await this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });

    return {
      ...car,
      porte: car.porte as Porte,
    };
  }

  async remove(id: string): Promise<void> {
    // Verificar se o carro existe
    await this.findOne(id);

    await this.prisma.car.delete({
      where: { id },
    });
  }
}
