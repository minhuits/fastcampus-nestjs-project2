import { NOTIFICATION_SERVICE } from "@app/common";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from 'joi';
import { PaymentModule } from "./payment/payment.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DB_URL: Joi.string().required(),
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
                        transport: Transport.REDIS,
                        options: {
                            host: 'redis',
                            port: 6379,
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