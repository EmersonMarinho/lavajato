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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentResponseDto, PriceCalculationDto, PriceCalculationResponseDto } from '../dto/appointment.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Agendamentos')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso', type: AppointmentResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Post('calculate-price')
  @ApiOperation({ summary: 'Calcular preço do serviço' })
  @ApiResponse({ status: 200, description: 'Preço calculado com sucesso', type: PriceCalculationResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  calculatePrice(@Body() priceCalculationDto: PriceCalculationDto) {
    return this.appointmentsService.calculatePrice(priceCalculationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos', type: [AppointmentResponseDto] })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('my-appointments')
  @ApiOperation({ summary: 'Listar agendamentos do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos do usuário', type: [AppointmentResponseDto] })
  findMyAppointments(@Request() req) {
    return this.appointmentsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter agendamento por ID' })
  @ApiResponse({ status: 200, description: 'Agendamento encontrado', type: AppointmentResponseDto })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento atualizado com sucesso', type: AppointmentResponseDto })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
