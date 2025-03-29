import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Bcrypt from 'bcryptjs'; // bcrypt 대신 bcryptjs로 변경
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getUserById(userId: string){
    const user = await this.userRepository.findOneBy({id: userId});

    if(!user){
      throw new BadRequestException('존재하지 않는 사용자입니다!');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
      }
    });

    if (user) {
      throw new BadRequestException('이미 가입한 이메일 입니다!')
    }

    const hash = await Bcrypt.hash(password, 10); // bcryptjs의 hash 메서드 사용

    await this.userRepository.save({
      ...createUserDto,
      email,
      password: hash,
    });

    return this.userRepository.findOne({
      where: {
        email,
      }
    });
  }
}