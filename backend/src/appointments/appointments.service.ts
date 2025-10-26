import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ServicesService } from '../services/services.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentResponseDto, PriceCalculationDto, PriceCalculationResponseDto, Status, Porte } from '../dto/appointment.dto';
import * as twilio from 'twilio';

@Injectable()
export class AppointmentsService {
  private twilioClient: twilio.Twilio;

  constructor(
    private readonly prisma: PrismaService,
    private readonly servicesService: ServicesService,
    private readonly configService: ConfigService,
  ) {
    // Inicializar cliente Twilio apenas se as credenciais forem válidas
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    
    if (accountSid && authToken && accountSid.startsWith('AC')) {
      try {
        this.twilioClient = twilio(accountSid, authToken);
      } catch (error) {
        console.log('Twilio não configurado corretamente, continuando sem notificações');
      }
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: createAppointmentDto.user_id },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Verificar se o carro existe
    const car = await this.prisma.car.findUnique({
      where: { id: createAppointmentDto.car_id },
    });

    if (!car) {
      throw new BadRequestException('Carro não encontrado');
    }

    // Verificar se a unidade existe
    const unit = await this.prisma.unit.findUnique({
      where: { id: createAppointmentDto.unit_id },
    });

    if (!unit) {
      throw new BadRequestException('Unidade não encontrada');
    }

    // Calcular preço final dos serviços
    const priceCalculation = await this.calculatePrice({
      porte: car.porte as Porte,
      service_ids: createAppointmentDto.service_ids,
    });

    // Calcular custo de busca e entrega se solicitado
    let custo_busca_entrega = 0;
    if (createAppointmentDto.inclui_busca_entrega) {
      custo_busca_entrega = this.calculatePickupDeliveryCost(user, unit);
    }

    // Preço final total
    const preco_final_total = priceCalculation.preco_final + custo_busca_entrega;

    // Criar agendamento
    const appointment = await this.prisma.appointment.create({
      data: {
        user_id: createAppointmentDto.user_id,
        car_id: createAppointmentDto.car_id,
        unit_id: createAppointmentDto.unit_id,
        status: Status.AGENDADO,
        data: new Date(createAppointmentDto.data),
        hora: createAppointmentDto.hora,
        preco_final: preco_final_total,
        inclui_busca_entrega: createAppointmentDto.inclui_busca_entrega || false,
        custo_busca_entrega,
        endereco_busca: createAppointmentDto.endereco_busca,
        observacoes_busca: createAppointmentDto.observacoes_busca,
      },
    });

    // Criar relacionamentos com serviços
    for (const serviceId of createAppointmentDto.service_ids) {
      await this.prisma.appointmentService.create({
        data: {
          appointment_id: appointment.id,
          service_id: serviceId,
        },
      });
    }

    // Buscar agendamento com serviços
    const appointmentWithServices = await this.findOne(appointment.id);

    return appointmentWithServices;
  }

  async findAll(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        },
        car: {
          select: {
            id: true,
            modelo: true,
            placa: true,
            porte: true,
          },
        },
        unit: {
          select: {
            id: true,
            nome: true,
            endereco: true,
          },
        },
        appointment_services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return appointments.map(appointment => ({
      ...appointment,
      status: appointment.status as Status,
      service_ids: appointment.appointment_services.map(as => as.service_id),
      inclui_busca_entrega: appointment.inclui_busca_entrega,
      custo_busca_entrega: appointment.custo_busca_entrega,
      endereco_busca: appointment.endereco_busca,
      observacoes_busca: appointment.observacoes_busca,
    }));
  }

  async findOne(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        },
        car: {
          select: {
            id: true,
            modelo: true,
            placa: true,
            porte: true,
          },
        },
        unit: {
          select: {
            id: true,
            nome: true,
            endereco: true,
          },
        },
        appointment_services: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return {
      ...appointment,
      status: appointment.status as Status,
      service_ids: appointment.appointment_services.map(as => as.service_id),
      inclui_busca_entrega: appointment.inclui_busca_entrega,
      custo_busca_entrega: appointment.custo_busca_entrega,
      endereco_busca: appointment.endereco_busca,
      observacoes_busca: appointment.observacoes_busca,
    };
  }

  async findByUser(userId: string): Promise<AppointmentResponseDto[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        },
        car: {
          select: {
            id: true,
            modelo: true,
            placa: true,
            porte: true,
          },
        },
        unit: {
          select: {
            id: true,
            nome: true,
            endereco: true,
          },
        },
        appointment_services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return appointments.map(appointment => ({
      ...appointment,
      status: appointment.status as Status,
      service_ids: appointment.appointment_services.map(as => as.service_id),
      inclui_busca_entrega: appointment.inclui_busca_entrega,
      custo_busca_entrega: appointment.custo_busca_entrega,
      endereco_busca: appointment.endereco_busca,
      observacoes_busca: appointment.observacoes_busca,
    }));
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentResponseDto> {
    // Verificar se o agendamento existe
    const existingAppointment = await this.findOne(id);

    // Se o status foi alterado para FINALIZADO, enviar mensagem WhatsApp
    if (updateAppointmentDto.status === Status.FINALIZADO && existingAppointment.status !== Status.FINALIZADO) {
      await this.sendWhatsAppNotification(id);
    }

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    // Verificar se o agendamento existe
    await this.findOne(id);

    // Remover relacionamentos com serviços
    await this.prisma.appointmentService.deleteMany({
      where: { appointment_id: id },
    });

    // Remover agendamento
    await this.prisma.appointment.delete({
      where: { id },
    });
  }

  async calculatePrice(priceCalculationDto: PriceCalculationDto): Promise<PriceCalculationResponseDto> {
    const services = await this.servicesService.findByIds(priceCalculationDto.service_ids);
    
    if (services.length === 0) {
      throw new BadRequestException('Nenhum serviço encontrado');
    }

    let preco_base_total = 0;
    let adicional_porte = 0;

    for (const service of services) {
      preco_base_total += service.preco_base;
      
      // Calcular adicional por porte
      switch (priceCalculationDto.porte) {
        case Porte.PEQUENO:
          adicional_porte += service.adicional_por_porte * 0.5; // 50% do adicional
          break;
        case Porte.MEDIO:
          adicional_porte += service.adicional_por_porte; // 100% do adicional
          break;
        case Porte.GRANDE:
          adicional_porte += service.adicional_por_porte * 1.5; // 150% do adicional
          break;
        default:
          adicional_porte += service.adicional_por_porte;
      }
    }

    const preco_final = preco_base_total + adicional_porte;

    return {
      preco_base_total,
      adicional_porte,
      preco_final,
      servicos: services.map(service => ({
        id: service.id,
        nome: service.nome,
        preco_base: service.preco_base,
        adicional_porte: service.adicional_por_porte,
      })),
    };
  }

  private calculatePickupDeliveryCost(user: any, unit: any): number {
    // Custo fixo de leva e traz: R$ 15,00
    return 15.00;
  }

  private async sendWhatsAppNotification(appointmentId: string): Promise<void> {
    try {
      if (!this.twilioClient) {
        console.log('Twilio não configurado, pulando notificação WhatsApp');
        return;
      }

      const appointment = await this.findOne(appointmentId);
      
      // Buscar dados completos para a notificação
      const fullAppointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          user: true,
          car: true,
          unit: true,
        },
      });

      if (!fullAppointment) {
        console.error('Agendamento não encontrado para notificação');
        return;
      }

      const message = `🚗💧 *Lavajato - Serviço Finalizado!*

Olá ${fullAppointment.user.nome}! Seu serviço foi finalizado com sucesso.

📋 *Detalhes do Serviço:*
• Carro: ${fullAppointment.car.modelo} - ${fullAppointment.car.placa}
• Unidade: ${fullAppointment.unit.nome}
• Endereço: ${fullAppointment.unit.endereco}
• Preço: R$ ${fullAppointment.preco_final.toFixed(2)}

⭐ *Pontos de Fidelidade:*
Você ganhou pontos! Continue usando nossos serviços.

Obrigado por escolher nosso lavajato! 🚿✨`;

      // Enviar mensagem via WhatsApp (requer número verificado no Twilio)
      const fromNumber = this.configService.get<string>('TWILIO_WHATSAPP_FROM');
      const toNumber = `whatsapp:+${fullAppointment.user.telefone.replace(/\D/g, '')}`;

      if (fromNumber) {
        await this.twilioClient.messages.create({
          body: message,
          from: `whatsapp:${fromNumber}`,
          to: toNumber,
        });

        console.log(`Notificação WhatsApp enviada para ${fullAppointment.user.telefone}`);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação WhatsApp:', error);
      // Não falhar o processo principal se a notificação falhar
    }
  }
}
