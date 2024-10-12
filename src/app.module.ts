import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CatsModule} from './cats/cats.module';
import {logger} from "./common/middleware/logger.middleware";
import {CatsController} from "./cats/cats.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {SongsModule} from './songs/songs.module';
import {AuthModule} from './auth/auth.module';
import {PlaylistsModule} from './playlists/playlists.module';
import {UsersModule} from './users/users.module';
import {ArtistsModule} from './artists/artists.module';
import {SeedModule} from './seed/seed.module';
import {dataSourceOptions} from "../db/data-source";
import {ConfigModule} from "@nestjs/config";

// 导入 配置环境
import configuration from "./config/configuration";
import {validate} from "../env.validation";

@Module({
    imports: [
        CatsModule,
        TypeOrmModule.forRoot(dataSourceOptions),
        SongsModule,
        AuthModule,
        PlaylistsModule,
        UsersModule,
        ArtistsModule,
        SeedModule,
        ConfigModule.forRoot({
            // envFilePath: ['.development.env', '.production.env'],
            isGlobal: true, //全局导入
            envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
            load: [configuration],
            validate,
        }),
        // TypeOrmModule.forRootAsync(typeOrmAsyncConfig)
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    constructor(private dataSource: DataSource) {
        console.log('dbName', this.dataSource.driver.database);
    }

    //引入 自定义中间件
    //exclude 排除自定义中间件的触发
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(logger).exclude(
            // {
            //     path: 'cats',
            //     method: RequestMethod.GET,
            // },
            // {
            //     path: 'cats',
            //     method: RequestMethod.POST
            // },
            // 'cats/(.*)'
        ).forRoutes(CatsController);
    }
}

