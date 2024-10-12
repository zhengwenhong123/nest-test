import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Song} from "../../songs/entities/song.entity";
import {User} from "../../users/user.entity";

@Entity('playlists')
export class Playlist {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    //一对多 一个播放列表关联多个歌曲
    @OneToMany(() => Song, (song) => song.artists)
    songs: Song[];

    //多对一 关联用户的播放列表
    @ManyToOne(() => User, (user) => user.playlist)
    user: User;
}
