import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Artist} from "../../artists/artist.entity";

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    // @Column('json')
    // artists: string[];

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    releaseDate?: Date;  //发布日期

    @Column('time')
    duration: Date;

    @Column('text')
    lyrics: string

    @ManyToMany(() => Artist, (artist) => artist.songs, {cascade: true})
    @JoinTable({name: 'songs_artists'})
    artists: Artist[];
}