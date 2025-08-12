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
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto, CarResponseDto } from '../dto/car.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Carros')
@Controller('cars')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo carro' })
  @ApiResponse({ status: 201, description: 'Carro cadastrado com sucesso', type: CarResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os carros' })
  @ApiResponse({ status: 200, description: 'Lista de carros', type: [CarResponseDto] })
  findAll() {
    return this.carsService.findAll();
  }

  @Get('my-cars')
  @ApiOperation({ summary: 'Listar carros do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de carros do usuário', type: [CarResponseDto] })
  findMyCars(@Request() req) {
    return this.carsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter carro por ID' })
  @ApiResponse({ status: 200, description: 'Carro encontrado', type: CarResponseDto })
  @ApiResponse({ status: 404, description: 'Carro não encontrado' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar carro' })
  @ApiResponse({ status: 200, description: 'Carro atualizado com sucesso', type: CarResponseDto })
  @ApiResponse({ status: 404, description: 'Carro não encontrado' })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover carro' })
  @ApiResponse({ status: 200, description: 'Carro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Carro não encontrado' })
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
