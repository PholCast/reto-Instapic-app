import { Photo } from "src/photo/entities/photo.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({
        type:'varchar',
        unique:true
    })
    username:string;

    @Column({type:'varchar'})
    email:string;

    @Column({type:'varchar'})
    name:string;

    @Column({type:'varchar'})
    password:string;

    @OneToMany(
        () => Photo,
        photo => photo.user,
        { cascade:true }
    )
    photos: Photo[];

}