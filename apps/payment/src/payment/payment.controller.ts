import { PaymentMicroservice } from '@app/common';
import { BadRequestException, Controller } from '@nestjs/common';
import { PaymentMethod } from './entity/payment.entity';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController implements PaymentMicroservice.PaymentServiceController {
  constructor(private readonly paymentService: PaymentService) { }

  async makePayment(request: PaymentMicroservice.MakePaymentRequest) {
    const payment = await this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethod,
    });

    // null 체크 추가
    if (!payment) {
      throw new BadRequestException('Payment failed');
    }

    return payment;
  }
}