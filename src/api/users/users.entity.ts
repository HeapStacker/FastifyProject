import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Address } from "./addresses/addresses.entity";
import { Item } from "./items/items.entity";
import { UsersConnection } from "./profiles/profiles.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @PrimaryGeneratedColumn("uuid")
    uuid: string

    @Column("varchar", { length: 100, unique: true })
    email: string

    @Column("varchar", { length: 100, unique: true })
    username: string

    @Column("varchar", { length: 100 })
    password: string

    @Column("varchar", { length: 100 })
    firstName: string

    @Column("varchar", { length: 100 })
    lastName: string

    @OneToOne(() => Address, address => address.user)
    @JoinColumn()
    place: Address

    @OneToMany(() => Item, item => item.user)
    items: Item[]

    @Column("varchar")
    dateOfBirth: Date

    @Column("boolean", { default: false })
    isLogged: boolean

    @Column("bool", { default: false })
    validated: boolean

    @Column("varchar", { nullable: true })
    fingerprint: string

    @Column("varchar", { nullable: true })
    passwordFingerprint: string

    @Column("bool", { default: false })
    canChangePassword: boolean

    @Column("text", { default: "" })
    description: string

    //visibility...
    @Column("varchar", { length: 10, default: "protected" })
    nameVisibility: string

    @Column("varchar", { length: 10, default: "protected" })
    descriptionVisibility: string

    @Column("varchar", { length: 10, default: "private" })
    placeVisibility: string

    @Column("varchar", { length: 10, default: "protected" })
    dobVisibility: string

    @OneToMany(() => UsersConnection, connection => connection.followedUser)
    followedUsers: User[]

    @OneToMany(() => UsersConnection, connection => connection.userThatFollows)
    usersThatFollowYou: User[]
}