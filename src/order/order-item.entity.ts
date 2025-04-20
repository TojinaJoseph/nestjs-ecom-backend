
import { Products } from "src/products/products.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderItem{
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Order, order => order.items,{
        onDelete:"CASCADE"
    })
    order: Order;
  
    @ManyToOne(() => Products,{ onDelete: 'CASCADE' })
    product: Products;
  
    @Column()
    quantity: number;
  
    @Column('decimal', { precision: 10, scale: 2 })
    price: number; // store snapshot price at time of purchase
}