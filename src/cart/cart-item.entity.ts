import { Products } from "src/products/products.entity"
import { Users } from "src/users/users.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Cart } from "./cart.entity"


@Entity()
export class CartItem{

@PrimaryGeneratedColumn()
id:number

@ManyToOne(() => Cart, (cart) => cart.items,{
    onDelete:'CASCADE'
})  //many cartitem will have one cart  ,cartitem will have fk for cartid as it is many to one
cart:Cart

@ManyToOne(() => Products, (product) => product.cartItems,{  //many cartitems have one product ,cartitem will have fk for productid
    eager:true,
    onDelete:'CASCADE'})  //autodelete cartitems when product is deleted  
product:Products  //checking

@Column()
quantity:number

@Column()
price:number

}