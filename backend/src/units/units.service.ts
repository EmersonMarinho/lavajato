import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto, UpdateUnitDto, UnitResponseDto } from '../dto/unit.dto';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUnitDto: CreateUnitDto): Promise<UnitResponseDto> {
    const unit = await this.prisma.unit.create({
      data: createUnitDto,
    });

    return unit;
  }

  async findAll(): Promise<UnitResponseDto[]> {
    return this.prisma.unit.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<UnitResponseDto> {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundException('Unidade não encontrada');
    }

    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<UnitResponseDto> {
    // Verificar se a unidade existe
    await this.findOne(id);

    const unit = await this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
    });

    return unit;
  }

  async remove(id: string): Promise<void> {
    // Verificar se a unidade existe
    await this.findOne(id);

    await this.prisma.unit.delete({
      where: { id },
    });
  }
}
