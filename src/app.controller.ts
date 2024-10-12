import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {AppService} from './app.service';
import {JwtAuthGaurd} from "./common/guards/jwt-guard";


@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    // 获取鉴权Token
    @Get('profile')
    @UseGuards(JwtAuthGaurd)
    getProfile(
        @Req()
            request,
    ) {
       console.log(request);
       // 返回用户
       return request.user;
    }
}
