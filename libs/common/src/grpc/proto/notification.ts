// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v5.29.3
// source: proto/notification.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "notification";

export interface SendPaymentNotificationRequest {
  to: string;
  orderId: string;
}

export interface SendPaymentNotificationResponse {
  from: string;
  to: string;
  subject: string;
  content: string;
  notificationStatus: string;
}

export const NOTIFICATION_PACKAGE_NAME = "notification";

export interface NotificationServiceClient {
  sendPaymentNotification(
    request: SendPaymentNotificationRequest,
    metadata?: Metadata,
  ): Observable<SendPaymentNotificationResponse>;
}

export interface NotificationServiceController {
  sendPaymentNotification(
    request: SendPaymentNotificationRequest,
    metadata?: Metadata,
  ):
    | Promise<SendPaymentNotificationResponse>
    | Observable<SendPaymentNotificationResponse>
    | SendPaymentNotificationResponse;
}

export function NotificationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["sendPaymentNotification"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("NotificationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("NotificationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const NOTIFICATION_SERVICE_NAME = "NotificationService";
