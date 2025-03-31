import { Module } from "@nestjs/common";
import { OrderModule } from "./order/order.module";
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        OrderModule,
        ProductModule,
        UserModule,
    ]
})
export class AppModule { }