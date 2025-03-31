import { GrpcInterceptor, NotificationMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { BadRequestException, Controller, UseInterceptors } from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send.payment.notification.dto';
import { NotificationService } from './notification.service';

@Controller()
@NotificationMicroservice.NotificationServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class NotificationController implements NotificationMicroservice.NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) { }

  async sendPaymentNotification(request: SendPaymentNotificationDto, metadata: Metadata) {
    const data = await this.notificationService.sendPaymentNotification(request, metadata);

    if (!data) {
      throw new BadRequestException('sendPaymentNotification!');
    }
    const resp = data.toJSON();

    return {
      ...resp,
      status: resp.status.toString(),
    }
  }
}