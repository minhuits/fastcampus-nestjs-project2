#!/bin/bash

docker buildx build --platform linux/amd64,linux/arm64 -t dorkerHub계정명/fc-nestjs-gateway -f ./apps/gateway/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t dorkerHub계정명/fc-nestjs-notification -f ./apps/notification/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t dorkerHub계정명/fc-nestjs-order -f ./apps/order/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t dorkerHub계정명/fc-nestjs-payment -f ./apps/payment/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t dorkerHub계정명/fc-nestjs-product -f ./apps/product/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t dorkerHub계정명/fc-nestjs-user -f ./apps/user/Dockerfile --target production .

docker push dorkerHub계정명/fc-nestjs-gateway:latest
docker push dorkerHub계정명/fc-nestjs-notification:latest
docker push dorkerHub계정명/fc-nestjs-order:latest
docker push dorkerHub계정명/fc-nestjs-payment:latest
docker push dorkerHub계정명/fc-nestjs-product:latest
docker push dorkerHub계정명/fc-nestjs-user:latest