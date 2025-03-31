import { NotificationMicroservice } from '@app/common';
import { BadRequestException, Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController implements NotificationMicroservice.NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) { }

  async sendPaymentNotification(payload: NotificationMicroservice.SendPaymentNotificationRequest) {
    const data = await this.notificationService.sendPaymentNotification(payload);

    if (!data) {
      throw new BadRequestException('sendPaymentNotification에 data가 null입니다!')
    }
    const resp = data.toJSON();

    return {
      ...resp,
      status: resp.status.toString(),
    };
  }
}