import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToOne } from "typeorm"
import { User } from "../users.entity"

@Entity()
export class Address extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { length: 100 })
    country: string

    @Column("varchar", { length: 100, nullable: true })
    city: string

    @Column("varchar", { length: 100, nullable: true })
    town: string

    @Column("varchar", { length: 100, nullable: true })
    vilage: string

    @Column("varchar", { length: 200 })
    address: string
    
    @Column("varchar", { length: 40 })
    postcode: string

    @OneToOne(() => User, user => user.place)
    user: User
}