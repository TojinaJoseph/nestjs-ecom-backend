import { Exclude } from "class-transformer";
import { Role } from "src/auth/enums/roles-type.enum";
import { Cart } from "src/cart/cart.entity";
import { Order } from "src/order/order.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

//one user will have only one cart,in cart it is related with cart.user,cascade:true - when user is created cart will be generated
@OneToOne(()=>Cart,(cart) => cart.user,{cascade:true,eager:true})  //eager true - fetch cart along with post  
// @JoinColumn()    //  user table will have cartId column generated,here cart should be created first before user created
cart:Cart

@Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;
  
  @OneToMany(()=>Order,(order)=>order.user)             //bidirectional one to one and many to one relation with order
  orders: Order[]
}