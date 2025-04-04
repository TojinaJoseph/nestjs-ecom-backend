import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users{
@PrimaryGeneratedColumn()
id:number; 

@Column({
    type:'varchar',
    length:96,
    nullable:false
})
firstName:string;

@Column({
    type:'varchar',
    length:96,
    nullable:true
})
lastName:string;

@Column({
    type:'varchar',
    length:96,
    nullable:false,
    unique:true
})
email:string;

@Column({
    type:'varchar',
    length:96,
    nullable:false
})
@Exclude()
password:string;
}