import { GrpcInterceptor, OrderMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Controller, UseInterceptors } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { OrderStatus } from './entity/order.entity';
import { PaymentMethod } from './entity/payment.entity';
import { OrderService } from './order.service';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class OrderController implements OrderMicroservice.OrderServiceController {
  constructor(private readonly orderService: OrderService) { }

  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    await this.orderService.changeOrderStatus(request.id, OrderStatus.deliveryStarted);
  }

  async createOrder(request: CreateOrderDto, metadata: Metadata) {
    return this.orderService.createOrder({
      ...request,
      payment: {
        ...request.payment,
        paymentMethod: request.payment?.paymentMethod as PaymentMethod
      }
    }, metadata);
  }
}