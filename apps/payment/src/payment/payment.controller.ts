import { PaymentMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { BadRequestException, Controller } from '@nestjs/common';
import { PaymentMethod } from './entity/payment.entity';
import { PaymentService } from './payment.service';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
export class PaymentController implements PaymentMicroservice.PaymentServiceController {
  constructor(private readonly paymentService: PaymentService) { }

  async makePayment(request: PaymentMicroservice.MakePaymentRequest, metadata: Metadata) {
    const payment = await this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethod,
    }, metadata);

    // null 체크 추가
    if (!payment) {
      throw new BadRequestException('Payment failed');
    }

    return payment;
  }
}