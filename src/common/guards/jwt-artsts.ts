/**
 *   基于角色中间件的鉴权
 * */

import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Observable} from "rxjs";
import {PayloadType} from "../../auth/types/Payload";

@Injectable()
export class JwtArtstsGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    }

    handleRequest<TUser = PayloadType>(err: any, user: any
    ): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        console.log(user.artistId);
        if (user.artistId) {
            return user
        }else{
            throw err || new UnauthorizedException();
        }

    }
}