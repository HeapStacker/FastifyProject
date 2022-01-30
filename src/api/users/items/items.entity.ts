import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { User } from "../users.entity"

@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @PrimaryGeneratedColumn("uuid")
    uuid: string

    @Column("varchar", { length: 100 })
    productName: string

    @Column("text")
    description: string

    @Column("decimal(15, 2)")
    price: number

    @ManyToOne(() => User, user => user.items)
    user: User
}