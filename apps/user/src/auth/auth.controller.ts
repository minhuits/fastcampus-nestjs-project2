import { UserMicroservice } from '@app/common';
import { BadRequestException, Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) { }

  parseBearerToken(request: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(request.token, false);
  }

  async registerUser(request: UserMicroservice.RegisterUserRequest) {
    const { token } = request;
    
    const tokenData = await this.authService.register(token, request);

    // null 체크 추가
    if (!tokenData) {
      throw new BadRequestException('Payment failed');
    }

    return tokenData;
  }

  loginUser(request: UserMicroservice.LoginUserRequest) {
    const { token } = request;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!')
    }

    return this.authService.login(token);
  }
}