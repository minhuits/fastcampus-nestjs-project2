import { NOTIFICATION_SERVICE, NotificationMicroservice, traceInterceptor } from "@app/common";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from 'joi';
import { join } from "path";
import { PaymentModule } from "./payment/payment.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DB_URL: Joi.string().required(),
                TCP_PORT: Joi.number().required(),
                NOTIFICATION_HOST: Joi.string().required(),
                NOTIFICATION_TCP_PORT: Joi.number().required()
            })
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.getOrThrow('DB_URL'),
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService]
        }),
        ClientsModule.registerAsync({
            clients: [
                {
                    name: NOTIFICATION_SERVICE,
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.GRPC,
                        options: {
                            channelOptions: {
                                interceptors: [traceInterceptor('Payment')],
                            },
                            package: NotificationMicroservice.protobufPackage,
                            protoPath: join(process.cwd(), 'proto/notification.proto'),
                            url: configService.getOrThrow('NOTIFICATION_GRPC_URL'),
                        }
                    }),
                    inject: [ConfigService]
                },
            ],
            isGlobal: true,
        }),
        PaymentModule,
    ],
})
export class AppModule { }