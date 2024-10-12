import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CreateAuthDto} from "./dto/create-auth.dto";
import * as bcrypt from 'bcryptjs';
import {JwtService} from "@nestjs/jwt";
import {ArtistsService} from "../artists/artists.service";
import {PayloadType} from "./types/Payload";
import {Artist} from "../artists/artist.entity";
import {Enable2FAType} from "../users/type/auth-types";
import * as speakeasy from 'speakeasy'
import {UpdateResult} from "typeorm";
import {User} from "../users/user.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
                private jwtService: JwtService,
                private artistsService: ArtistsService,
                private configService: ConfigService,) {

    }

    //登录
    async login(loginDto: CreateAuthDto): Promise<{ artist: Artist; accessToken: string } | {
        message: string,
        validate2FA: string
    }> {

        const user = await this.userService.fineOne(loginDto);
        const {email, id} = user;

        // 比较 密码
        const passwordMatch = await bcrypt.compare(
            loginDto.password,
            user.password,
        )

        if (passwordMatch) {
            delete user.password;
            const payload: PayloadType = {email, userId: id}

            const artist = await this.artistsService.findArtist(id); // 2
            //查找是否是该用户
            if (artist) {
                payload.artistId = artist.id;
            }

            if (user.enable2FA && user.twoFASecret) {
                //1.
                // sends the validateToken request link
                // else otherwise sends the json web token in the response
                return {
                    //2.
                    validate2FA: 'http://localhost:3001/auth/validate-2fa',
                    message:
                        'Please sends the one time password/token from your Google Authenticator App',
                };
            }
            // 生成Token jwt鉴权
            return {
                accessToken: this.jwtService.sign(payload),
                artist,
            }
            // return user;
        } else {
            throw new UnauthorizedException('密码不正确 请重新输入');
        }
    }

    /**
     *  双重验证 2FA
     * */
    async enable2FA(userId: number): Promise<Enable2FAType> {
        const user = await this.userService.findById(userId); //1
        if (user.enable2FA) {
            //2
            return {secret: user.twoFASecret};
        }
        const secret = speakeasy.generateSecret(); //3
        console.log(secret);
        user.twoFASecret = secret.base32; //4
        await this.userService.updateSecretKey(user.id, user.twoFASecret); //5
        return {secret: user.twoFASecret}; //6
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userService.disable2FA(userId);
    }

    async validate2FAToken(
        userId: number,
        token: string,
    ): Promise<{ verified: boolean }> {
        try {
            // find the user on the based on id
            const user = await this.userService.findById(userId);

            // extract his 2FA secret
            console.log(user.twoFASecret);
            // verify the secret with token by calling the speakeasy verify method
            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                token: token,
                encoding: 'base32',
            });

            // if validated then sends the json web token in the response
            if (verified) {
                return {verified: true};
            } else {
                return {verified: false};
            }
        } catch (err) {
            throw new UnauthorizedException('Error verifying token');
        }
    }

    async validateUserByApiKeys(apiKey: string): Promise<User | {}> {
        return this.userService.findByApiKey(apiKey);
    }

    //  获取env 变量啊
    getEnvVariables() {
        return {
            port:this.configService.get<number>('port'),
        }
    }
}
