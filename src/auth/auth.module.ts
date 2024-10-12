import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt-strategy";
import {ArtistsModule} from "../artists/artists.module";
import {ApiKeyStrategy} from "./ApiKeyStrategy";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [UsersModule, PassportModule, ArtistsModule, JwtModule.registerAsync({
        // secret: authConstants.secret, //密钥
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('secret'),
            signOptions: { // 签名选项
                expiresIn: '1d' //过期时间
            }
        }),
        inject: [ConfigService],
    }),
        ConfigModule.forRoot({
            envFilePath: ['.development.env', '.production.env'] //局部导入
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ApiKeyStrategy],
    exports: [AuthService],
})
export class AuthModule {
}
