import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, Req, UseGuards
} from '@nestjs/common';
import {SongsService} from './songs.service';
import {CreateSongDto} from './dto/create-song.dto';
import {Pagination} from 'nestjs-typeorm-paginate';
import {Song} from "./entities/song.entity";
import {UpdateSongDto} from "./dto/update-song.dto";
import {DeleteResult, UpdateResult} from "typeorm";
import {JwtArtstsGuard} from "../common/guards/jwt-artsts";

@Controller('songs')
export class SongsController {
    constructor(private readonly songsService: SongsService) {
    }

    @Post()
    @UseGuards(JwtArtstsGuard)
    create(@Body() createSongDto: CreateSongDto,@Req() req):Promise<Song> {
        console.log(req.user);
        return this.songsService.create(createSongDto);
    }

    @Get()
    findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10): Promise<Pagination<Song>> {
        limit = limit > 100 ? 100 : limit;
        return this.songsService.paginate({
            page,
            limit
        })
    }

    @Get(':id')
    findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number): Promise<Song> {
        return this.songsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSongDto: UpdateSongDto): Promise<UpdateResult> {
        return this.songsService.update(id, updateSongDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.songsService.remove(id);
    }
}
