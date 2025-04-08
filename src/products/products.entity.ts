import { CartItem } from "src/cart/cart-item.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Products{

@PrimaryGeneratedColumn()
id:number

@Column({
    type:'varchar',
    length:96,
    nullable:false,
    unique:true
})
title:string;

@Column({
    type:'varchar',
    length:216,
    nullable:false
})
description:string;

@Column({
    type:'int',
    nullable:false
})
price:number;

@Column({
    type:'varchar',
    length:96,
    nullable:false
})
category:string;

@Column({
    type:'int',
    nullable:true
})
rating:number;

@Column({
    type:'varchar',
    nullable:true
})
featuredImageUrl:string;

@Column({
    type:'varchar',
    nullable:true,
})
slug:string;

 // one Product appears in many cart items
@OneToMany(() => CartItem, (cartItem) => cartItem.product)
cartItems:CartItem[]  //checking
}