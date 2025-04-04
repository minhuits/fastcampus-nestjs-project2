// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v5.29.3
// source: proto/product.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "product";

export interface CreateSamplesRequest {
}

export interface CreateSamplesResponse {
  success: boolean;
}

export interface GetProductsInfoRequest {
  productIds: string[];
}

export interface GetProductsInfoResponse {
  products: GetProductsInfoResponse_ProductInfo[];
}

export interface GetProductsInfoResponse_ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export const PRODUCT_PACKAGE_NAME = "product";

export interface ProductServiceClient {
  createSamples(request: CreateSamplesRequest, metadata?: Metadata): Observable<CreateSamplesResponse>;

  getProductsInfo(request: GetProductsInfoRequest, metadata?: Metadata): Observable<GetProductsInfoResponse>;
}

export interface ProductServiceController {
  createSamples(
    request: CreateSamplesRequest,
    metadata?: Metadata,
  ): Promise<CreateSamplesResponse> | Observable<CreateSamplesResponse> | CreateSamplesResponse;

  getProductsInfo(
    request: GetProductsInfoRequest,
    metadata?: Metadata,
  ): Promise<GetProductsInfoResponse> | Observable<GetProductsInfoResponse> | GetProductsInfoResponse;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createSamples", "getProductsInfo"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCT_SERVICE_NAME = "ProductService";
