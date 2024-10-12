import {Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";
import {Song} from "../songs/entities/song.entity";

@Entity('artists')
export class Artist {
    // 实现一对一 关系
    @PrimaryGeneratedColumn()

    id: number;
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    //实现 多对多 关系
    @ManyToMany(() => Song, (song => song.artists))
    songs: Song[];
}