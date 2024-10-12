import {Module} from '@nestjs/common';
import {SongsService} from './songs.service';
import {SongsController} from './songs.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Song} from "./entities/song.entity";
import {Artist} from "../artists/artist.entity";
import {User} from "../users/user.entity";
import {Playlist} from "../playlists/entities/playlist.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Song, Artist, User])],
    controllers: [SongsController],
    providers: [SongsService],
})
export class SongsModule {
}
