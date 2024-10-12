/**
 *  创建策略服务
 * */

import {Injectable} from "@nestjs/common";
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from "passport-jwt";
import {authConstants} from "./Constant/auth.constants";
import {PayloadType} from "./types/Payload";

//策略
/**
 *   jwtFromRequest 这个选项是请求jwt方式 将请求的Authorization头中提取 Bearer Token
 *   ignoreExpiration: 表示在验证jwt的时候不忽略过期时间  如果Token过期 将被视为无效
 *   secretOrkey: 表示验证jwt的密钥私钥
 * */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authConstants.secret,
        });
    }

    async validate(payload: PayloadType) {
        return {userId: payload.userId, email: payload.email, artistId: payload.artistId,}
    }
}