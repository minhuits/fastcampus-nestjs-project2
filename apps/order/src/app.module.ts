import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import * as Joi from 'joi';
import { OrderModule } from "./order/order.module";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                HTTP_PORT: Joi.number().required(),
                USER_HOST: Joi.string().required(),
                USER_TCP_PORT: Joi.number().required(),
                DB_URL: Joi.string().required(),
            })
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.getOrThrow('DB_URL'),
            }),
            inject: [ConfigService],
        }),
        ClientsModule.registerAsync({
            clients: [
                {
                    name: 'USER_SERVICE',
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.TCP,
                        options: {
                            host: 'user', // User MS의 호스트
                            port: 3001,        // User MS의 포트
                        }
                    }),
                    inject: [ConfigService]
                }
            ],
            isGlobal: true,
        }),
        OrderModule
    ]
})
export class AppModule { }