import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('photos')
export class Photo{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'varchar'})
    url:string;

    @CreateDateColumn({name:'create_date'})
    creationDate:Date;

    @ManyToOne(
        () => User,
        user => user.photos
    )
    user: User;


}