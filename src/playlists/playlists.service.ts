import {Injectable} from '@nestjs/common';
import {CreatePlaylistDto} from './dto/create-playlist.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Playlist} from "./entities/playlist.entity";
import {Repository} from "typeorm";
import {User} from "../users/user.entity";
import {Song} from "../songs/entities/song.entity";

@Injectable()
export class PlaylistsService {
    constructor(@InjectRepository(Playlist) private playListRepository: Repository<Playlist>,
                @InjectRepository(User) private UserRepository: Repository<User>,
                @InjectRepository(Song) private SongRepository: Repository<Song>,) {
    }

    async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {

        const playList = new Playlist();
        playList.name = createPlaylistDto.name;

        playList.songs = await this.SongRepository.findByIds(createPlaylistDto.songs);

        playList.user = await this.UserRepository.findOneBy({id: createPlaylistDto.user})


        return this.playListRepository.save(playList);
    }

}
