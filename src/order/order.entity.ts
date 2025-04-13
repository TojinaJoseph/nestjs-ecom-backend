import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ShippingAddress } from "./shipping-address.entity";
import { StatusType } from "./enums/status-type.enum";
import { Users } from "src/users/users.entity";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id: number;
   
    @OneToMany(()=>OrderItem,(item)=>item.order,{cascade:true})
    items: OrderItem[];

    @OneToOne(() => ShippingAddress,(shippingAddress)=>shippingAddress.order, { cascade: true, eager: true })             //every order only have one shippingaddress                                                               //create a shippingaddressId(foreignkey) in order table
    shippingAddress: ShippingAddress;
  
    // @OneToOne(() => Payment, { nullable: true, cascade: true })
    // @JoinColumn()
    // payment: Payment;
  
    @Column({
        type: 'enum',
        enum: StatusType,
        default: StatusType.Pending,
      })
      status: StatusType;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(()=>Users,(users)=>users.orders,{
        eager:true,
    })    //foreign key will be in this entity
    user: Users;           //order has many to one relation with user

    @Column('decimal')
    totalPrice: number;
}