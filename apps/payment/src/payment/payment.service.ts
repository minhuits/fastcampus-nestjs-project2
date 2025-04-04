import { constructMetadata, NOTIFICATION_SERVICE, NotificationMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make.payment.dto';
import { Payment, PaymentStatus } from './entity/payment.entity';

@Injectable()
export class PaymentService implements OnModuleInit {
  notificationService: NotificationMicroservice.NotificationServiceClient;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationMicroservice: ClientGrpc,
  ) { }

  onModuleInit() {
    this.notificationService = this.notificationMicroservice.getService<NotificationMicroservice.NotificationServiceClient>(
      'NotificationService',
    );
  }

  async makePayment(payload: MakePaymentDto, metadata: Metadata) {
    let paymentId;

    try {
      const result = await this.paymentRepository.save(payload);

      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(result.id, PaymentStatus.approved);

      this.sendNotification(payload.orderId, payload.userEmail, metadata);

      return this.paymentRepository.findOneBy({ id: result.id });
    } catch (e) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.rejected);
      }

      throw e;
    }

  }

  async processPayment() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    await this.paymentRepository.update({
      id,
    }, {
      paymentStatus: status,
    });
  }

  async sendNotification(orderId: string, to: string, metadata: Metadata) {
    const resp = await lastValueFrom(this.notificationService.sendPaymentNotification({
      to,
      orderId,
    }, constructMetadata(PaymentService.name, 'sendNotification', metadata)))
  }
}