import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Playlist} from "../playlists/entities/playlist.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn() // 主键
    id: number

    @ApiProperty({
        example: 'Jane',
        description: 'provide the firstName of the user',
    })
    @Column()
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'provide the lastName of the user',
    })
    @Column()
    lastName: string;

    @ApiProperty({
        example: 'jane_doe@gmail.com',
        description: 'provide the email of the user',
    })
    @Column({unique: true})
    email: string;

    @ApiProperty({
        description: 'provide the password of the user',
    })
    @Column()
    password: string

    @Column({nullable: true, type: 'text'})
    twoFASecret: string;

    @Column({default: false, type: 'boolean'})
    enable2FA: boolean;

    @Column()
    apiKey: string;

    @Column('json', {nullable: true})
    rateLimit: { count: number; lastRequest: number };


    @OneToMany(() => Playlist, (playList) => playList.user)
    playlist: Playlist;

}