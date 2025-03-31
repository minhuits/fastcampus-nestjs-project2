import { RpcInterceptor } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create.order.dto';
import { DeliveryStartedDto } from './dto/delivery.started.dto';
import { OrderStatus } from './entity/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @EventPattern({ cmd: 'delivery_started' })
  @UseInterceptors(RpcInterceptor)
  async deliveryStarted(@Payload() payload: DeliveryStartedDto) {
    await this.orderService.changeOrderStatus(payload.id, OrderStatus.deliveryStarted);
  }

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(@Payload() createOrderDto: CreateOrderDto) {
    console.log('create order')
    return this.orderService.createOrder(createOrderDto);
  }
}