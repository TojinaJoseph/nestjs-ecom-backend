import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: number;

  @Column()
  country: string;

  @Column()
  phoneNumber: number;

  @OneToOne(()=>Order,(order)=>order.shippingAddress,{
    onDelete: 'CASCADE'         //auto delete on orede delete
  })       //creating bidirectional one to one so that while deleting shipping address it will delete the order as well
  @JoinColumn()  //changing foreign key from order entity to shipping address because we need to delete shippingaddress whenever an order deleted
  order: Order;
}