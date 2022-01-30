import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users.entity";

@Entity()
export class UsersConnection extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.followedUsers)
    followedUser: User
    
    @ManyToOne(() => User, user => user.usersThatFollowYou, {onDelete: "SET NULL"})
    userThatFollows: User
}