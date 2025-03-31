import { ProductMicroservice } from '@app/common';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { GetProductsInfo } from './dto/get.products.info.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController implements ProductMicroservice.ProductServiceController {
  constructor(private readonly productService: ProductService) { }

  async createSamples() {
    const resp = await this.productService.createSamples();

    return {
      success: resp,
    }
  }

  async getProductsInfo(request: GetProductsInfo) {
    const resp = await this.productService.getProductsInfo(request.productIds);

    return {
      products: resp,
    }
  }
}