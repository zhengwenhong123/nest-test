import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus, Inject,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Redirect, SetMetadata, UseGuards, UseInterceptors
} from '@nestjs/common';
import {CreateCatDto} from "./dto/create-cat.dto";
import {CatsService} from "./cats.service";
import {RolesGuard} from "../common/guards/roles-guard.service";
import {Roles} from "../common/decorator/role.decorator";
import {LoggingInterceptor} from "../cors/logging.interceptor";
import {User} from "../common/decorator/user.decorator";
import {Connection} from "../common/constatnts/connection";

@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(new LoggingInterceptor())
export class CatsController {
    constructor(
        private catService: CatsService,
        @Inject('connection')
        private connection: Connection,
    ) {}
    @Get('docs')
    @Redirect('https://nest.nodejs.cn', 301)
    getDocs(@Query('version') version) {
        console.log(version);
        if(version && version === '5'){
            return {
                url:"https://nest.nodejs.cn/v5",
            }
        }
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return id;
    }

    @Post()
    @Roles(['admin'])
    async create(@Body() createCatDto: CreateCatDto): Promise<any> {
        console.log(createCatDto);
        this.catService.create(createCatDto)
    }

    @Get()
    // @Auth('admin')
    // @Roles(['admin'])
    async findAll(@User('firstName') firstName: string) {
        // return this.connection.DB;
        // return this.catService.findAll();
    }
}
