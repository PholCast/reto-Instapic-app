import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...user } = createUserDto;
      const passwordHash = bcrypt.hashSync(password, 10);
      const newUser = this.userRepository.create({
        password: passwordHash,
        ...user
      });
      const userDB = await this.userRepository.save(newUser);
      return {
        success: true,
        token: this.getToken(userDB)
      }
    } catch (error) {
      throw new BadRequestException({code:error.code, detail:error.detail})
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(username: string) {
    return this.userRepository.find({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        photos: true
      },
      relations: {
        photos: true
      }
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  getToken(user: User) {
    const { password: _, ...userPayload } = user;
    return this.jwtService.sign(userPayload);
  }
}
