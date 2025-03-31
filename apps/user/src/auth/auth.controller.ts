import { UserMicroservice } from '@app/common';
import { BadRequestException, Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) { }

  parseBearerToken(payload: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(payload.token, false);
  }

  async registerUser(registerDto: UserMicroservice.RegisterUserRequest) {
    const { token } = registerDto;
    
    const tokenData = await this.authService.register(token, registerDto);

    // null 체크 추가
    if (!tokenData) {
      throw new BadRequestException('Payment failed');
    }

    return tokenData;
  }

  loginUser(loginDto: UserMicroservice.LoginUserRequest) {
    const { token } = loginDto;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!')
    }

    return this.authService.login(token);
  }
}