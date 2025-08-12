import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from '../dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.prisma.service.create({
      data: createServiceDto,
    });

    return service;
  }

  async findAll(): Promise<ServiceResponseDto[]> {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<ServiceResponseDto> {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return service;
  }

  async findByIds(ids: string[]): Promise<ServiceResponseDto[]> {
    const services = await this.prisma.service.findMany({
      where: {
        id: { in: ids },
      },
    });

    return services;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceResponseDto> {
    // Verificar se o serviço existe
    await this.findOne(id);

    const service = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });

    return service;
  }

  async remove(id: string): Promise<void> {
    // Verificar se o serviço existe
    await this.findOne(id);

    await this.prisma.service.delete({
      where: { id },
    });
  }
}
