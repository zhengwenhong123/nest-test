import {Module} from '@nestjs/common';
import {PlaylistsService} from './playlists.service';
import {PlaylistsController} from './playlists.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Playlist} from "./entities/playlist.entity";
import {Song} from "../songs/entities/song.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Playlist,User,Song])],
    controllers: [PlaylistsController],
    providers: [PlaylistsService],
})
export class PlaylistsModule {
}
