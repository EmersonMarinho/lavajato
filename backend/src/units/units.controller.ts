import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UnitsService } from './units.service';
import { CreateUnitDto, UpdateUnitDto, UnitResponseDto } from '../dto/unit.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Unidades')
@Controller('units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova unidade' })
  @ApiResponse({ status: 201, description: 'Unidade criada com sucesso', type: UnitResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as unidades' })
  @ApiResponse({ status: 200, description: 'Lista de unidades', type: [UnitResponseDto] })
  findAll() {
    return this.unitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter unidade por ID' })
  @ApiResponse({ status: 200, description: 'Unidade encontrada', type: UnitResponseDto })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar unidade' })
  @ApiResponse({ status: 200, description: 'Unidade atualizada com sucesso', type: UnitResponseDto })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover unidade' })
  @ApiResponse({ status: 200, description: 'Unidade removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
