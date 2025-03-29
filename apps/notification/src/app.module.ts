import { ORDER_SERVICE } from "@app/common";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import * as Joi from 'joi';
import { NotificationModule } from "./notification/notification.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
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
                    name: ORDER_SERVICE,
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.TCP,
                        options: {
                            host: configService.getOrThrow<string>('ORDER_HOST'),
                            port: configService.getOrThrow<number>('ORDER_TCP_PORT'),
                        }
                    }),
                    inject: [ConfigService]
                },
            ],
            isGlobal: true,
        }),
        NotificationModule,
    ],
})
export class AppModule { }