import { Users } from "src/users/users.entity"
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { CartItem } from "./cart-item.entity"

@Entity()
export class Cart{

@PrimaryGeneratedColumn()
id:number

@OneToOne(() => Users, users => users.cart,{
    onDelete:'CASCADE'
})   //it is one to one bidirectional
@JoinColumn()  //user should be created first before creating cart ,fk should be reside cart because need to delete users first then cart
user:Users    // inorder to delete,first need to delete cart where the foreign key resides in one to one ,will not allow deleting user first as userid exist in another entry ie in cart here

 // Cart has many items
 @OneToMany(() => CartItem, (cartItem) => cartItem.cart,{eager:true})   //{ cascade: true, eager: true }  one cart have many cartitems
items:CartItem[]

}