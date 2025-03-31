import { OrderMicroservice } from '@app/common';
import { Controller } from '@nestjs/common';
import { OrderStatus } from './entity/order.entity';
import { PaymentMethod } from './entity/payment.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController implements OrderMicroservice.OrderServiceController {
  constructor(private readonly orderService: OrderService) { }

  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    await this.orderService.changeOrderStatus(request.id, OrderStatus.deliveryStarted);
  }

  // TODO:ERROR 수정하기
  // ERROR: OrderController 형식의 createOrder 속성을 기본 형식 OrderServiceController 의 동일한 속성에 할당할 수 없습니다.
  async createOrder(request: OrderMicroservice.CreateOrderRequest) {
    return this.orderService.createOrder({
      ...request,
      payment: {
        ...request.payment,
        paymentMethod: request.payment?.paymentMethod as PaymentMethod
      }
    });
  }
}