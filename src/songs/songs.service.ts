import {Injectable} from '@nestjs/common';
import {CreateSongDto} from './dto/create-song.dto';
import {UpdateSongDto} from './dto/update-song.dto';
import {Song} from "./entities/song.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {Artist} from "../artists/artist.entity";

@Injectable()
export class SongsService {
    constructor(@InjectRepository(Song) private songsRepository: Repository<Song>,
                @InjectRepository(Artist) private ArtistRepository: Repository<Artist>,) {
    }

    async create(createSongDto: CreateSongDto): Promise<Song> {
        const song = new Song();
        song.title = createSongDto.title;
        song.artists = createSongDto.artists;
        song.duration = createSongDto.duration;
        song.lyrics = createSongDto.lyrics;
        song.releaseDate = createSongDto.releaseDate ? createSongDto.releaseDate : new Date();

        // 查找所有传入的艺术家 ID
        const artists = await this.ArtistRepository.findByIds(createSongDto.artists);

        // 将查找到的艺术家数组赋值给 song.artists
        song.artists = artists;


        return this.songsRepository.save(song);
    }

    //查找所有歌曲
    findAll(): Promise<Song[]> {
        return this.songsRepository.find();
    }

    //更具id 进行查找
    findOne(id: number) {
        return this.songsRepository.findOneBy({id});
    }

    // 更新数据
    update(id: number, updateSongDto: UpdateSongDto) {
        return this.songsRepository.update(id, updateSongDto)
    }

    // 更具id 进行删除
    remove(id: number) {
        return this.songsRepository.delete(id);
    }

    // 进行数据分页处理
    // async paginate(options:IPaginationOptions):Promise<Pagination<CreateAlbumDto>>{
    //     const queryBuilder = this.songsRepository.createQueryBuilder('song');
    //     console.log(queryBuilder);
    //     return paginate<CreateAlbumDto>(queryBuilder,options);
    // }

    paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
        //查找songs表
        const queryBuilder = this.songsRepository.createQueryBuilder('songs')
        return paginate<Song>(queryBuilder, options);
    }
}
