import { PAYMENT_SERVICE, PaymentMicroservice, PRODUCT_SERVICE, ProductMicroservice, USER_SERVICE, UserMicroservice } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { AddressDto } from './dto/address.dto';
import { CreateOrderDto } from './dto/create.order.dto';
import { PaymentDto } from './dto/payment.dto';
import { Customer } from './entity/customer.entity';
import { Order, OrderStatus } from './entity/order.entity';
import { Product } from './entity/product.entity';
import { PaymentCancelledExcpetion } from './exception/payment.cancelled.exception';
import { PaymentFailedException } from './exception/payment.failed.exception';

@Injectable()
export class OrderService implements OnModuleInit {
  userService: UserMicroservice.UserServiceClient;
  productService: ProductMicroservice.ProductServiceClient;
  paymentService: PaymentMicroservice.PaymentServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientGrpc,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroservice: ClientGrpc,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>
  ) {

  }
  onModuleInit() {
    this.userService = this.userMicroservice.getService<UserMicroservice.UserServiceClient>(
      'UserService',
    );

    this.productService = this.productMicroservice.getService<ProductMicroservice.ProductServiceClient>(
      'ProductService',
    );

    this.paymentService = this.paymentMicroservice.getService<PaymentMicroservice.PaymentServiceClient>(
      'PaymentService',
    );
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { productIds, address, payment, meta } = createOrderDto;

    /// 1) 사용자 정보 가져오기
    const user = await this.getUserFromToken(meta.user.sub);

    /// 2) 상품 정보 가져오기
    const products = await this.getProductsByIds(productIds);

    /// 3) 총 금액 계산하기
    const totalAmount = this.calculateTotalAmount(products);

    /// 4) 금액 검증하기 - total이 맞는지 (프론트에서 보내준 데이터랑)
    this.validatePaymentAmount(totalAmount, payment.amount);

    /// 5) 주문 생성하기 - 데이터베이스에 넣기
    const customer = this.createCustomer(user);
    const order = await this.createNewOrder(customer, products, address, payment);

    /// 6) 결제 시도하기
    await this.processPayment(order._id.toString(), payment, user.email);

    /// 7) 결과 반환하기
    // return this.orderModel.findById(order._id);
    const createOrder = await this.orderModel.findById(order._id).exec();
    if (!createOrder) {
      throw new Error("Order not found");
    }
    return createOrder;
  }

  private async getUserFromToken(userId: string) {
    /// 1) User MS : JWT 토큰 검증
    // const tResp = await lastValueFrom(this.userService.send({ cmd: 'parse_bearer_token' }, { token }));

    // if (tResp.status === 'error') {
    //   throw new PaymentCancelledExcpetion(tResp);
    // }

    // /// 2) User MS : 사용자 정보 가져오기
    // const userId = tResp.data.sub;
    const uResp = await lastValueFrom(this.userService.getUserInfo({ userId }));

    return uResp;
  }

  private async getProductsByIds(productIds: string[]): Promise<Product[]> {
    const resp = await lastValueFrom(this.productService.getProductsInfo({
      productIds,
    }));

    /// Product 엔티티로 전환
    return resp.products.map((product) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
    }));
  }

  private calculateTotalAmount(product: Product[]) {
    return product.reduce((acc, next) => acc + next.price, 0)
  }

  private validatePaymentAmount(totalA: number, totalB: number) {
    if (totalA !== totalB) {
      throw new PaymentCancelledExcpetion('결제하려는 금액이 변경됐습니다!');
    }
  }

  private createCustomer(user: { id: string, email: string, name: string }) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    }
  }

  private createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto
  ) {
    return this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    })
  }

  async processPayment(orderId: string, payment: PaymentDto, userEmail: string) {
    try {
      const resp = await lastValueFrom(this.paymentService.makePayment({
        ...payment,
        userEmail,
        orderId,
      }));

      const isPaid = resp.paymentStatus === 'Approved';
      const orderStatus = isPaid ? OrderStatus.paymentProcessed : OrderStatus.paymentFailed;

      if (orderStatus === OrderStatus.paymentFailed) {
        throw new PaymentFailedException(resp);
      }

      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.paymentProcessed,
      });

      return resp;
    } catch (e) {
      if (e instanceof PaymentFailedException) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          status: OrderStatus.paymentFailed,
        });
      }

      throw e;
    }

  }

  changeOrderStatus(orderId: string, status: OrderStatus) {
    return this.orderModel.findByIdAndUpdate(orderId, { status });
  }
}