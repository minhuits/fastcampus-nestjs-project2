import { UserMicroservice } from '@app/common/grpc';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) { }

  getUserInfo(data: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(data.userId);
  }
}