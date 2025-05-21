import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Photo } from './entities/photo.entity';

@Injectable()
export class PhotoService {

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>
  ) { }

  create(createPhotoDto: CreatePhotoDto) {
    const photo = this.photoRepository.create({
      url:createPhotoDto.url,
      user:{
        id:createPhotoDto.userId
      }
    })
    return this.photoRepository.save(photo);
  }

  findAll() {
    return this.photoRepository.find();
  }

  findAllByUser(userId:string) {
    return this.photoRepository.find({
      where:{user:{id:userId}},
      select:{
        id:true,
        url:true,
        user:{username:true}
      },
      relations:{user:true}
    });
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}


