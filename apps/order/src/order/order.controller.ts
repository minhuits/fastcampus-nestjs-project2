import { OrderMicroservice } from '@app/common';
import { Controller } from '@nestjs/common';
import { OrderStatus } from './entity/order.entity';
import { PaymentMethod } from './entity/payment.entity';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';

@Controller('order')
export class OrderController implements OrderMicroservice.OrderServiceController {
  constructor(private readonly orderService: OrderService) { }

  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    await this.orderService.changeOrderStatus(request.id, OrderStatus.deliveryStarted);
  }

  async createOrder(request: CreateOrderDto) {
    return this.orderService.createOrder({
      ...request,
      payment: {
        ...request.payment,
        paymentMethod: request.payment?.paymentMethod as PaymentMethod
      }
    });
  }
}