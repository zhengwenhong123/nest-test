import {Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {User} from "../users/user.entity";
import {CreateUserDto} from "../users/dto/createUserDto";
import {AuthService} from "./auth.service";
import {CreateAuthDto} from "./dto/create-auth.dto";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGaurd} from "../common/guards/jwt-guard";
import {Enable2FAType} from "../users/type/auth-types";
import {UpdateResult} from "typeorm";
import {ValidateTokenDTO} from "./dto/validate-token.dto";
import {ApiRateLimitError} from "./error/ApiRateLimitError";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly userService: UsersService,
                private readonly authService: AuthService,) {
    }



    //注册
    @Post('signup')
    @ApiOperation({ summary: '注册新用户 ' })
    @ApiResponse({
        status: 201,
        description: '在响应中返回用户',
    })
    signup(@Body() userDTO: CreateUserDto): Promise<User> {
        return this.userService.create(userDTO);
    }

    @Post('login')
    @ApiOperation({
        summary:"用户登录"
    })
    @ApiResponse({
        status:200,
        description:'会在响应中返回token'
    })
    login(@Body() loginDto: CreateAuthDto): Promise<{ accessToken: string } | {
        message: string,
        validate2FA: string
    }> {
        return this.authService.login(loginDto);
    }

    //开启2fa验证
    @Post('enable-2fa')
    @ApiBearerAuth('jwt-auth')
    @UseGuards(JwtAuthGaurd)
    enable2FA(@Req() req): Promise<Enable2FAType> {
        return this.authService.enable2FA(req.user.userId);
    }


    //关闭2fa验证
    @Get('disable-2fa')
    @UseGuards(JwtAuthGaurd)
    disable2FA(@Req() req): Promise<UpdateResult> {
        return this.authService.disable2FA(req.user.userId);
    }


    //验证一次性token
    @Post('validate-2fa')
    @UseGuards(JwtAuthGaurd)
    validate2FA(
        @Req()
            req,
        @Body()
            ValidateTokenDTO: ValidateTokenDTO,
    ): Promise<{ verified: boolean }> {
        console.log(ValidateTokenDTO)
        return this.authService.validate2FAToken(
            req.user.userId,
            ValidateTokenDTO.token,
        );
    }

    @Get('profile')
    @ApiBearerAuth('jwt-auth')
    @UseGuards(AuthGuard('bearer'))
    getProfile(@Req() req) {
        try {
            delete req.user.password;
            return {
                msg: '使用API密钥进行身份验证',
                user: req.user,
            }
        }catch(error) {
            if (error instanceof ApiRateLimitError) {
                throw new HttpException({
                    status: HttpStatus.TOO_MANY_REQUESTS,
                    error: error.message,
                }, HttpStatus.TOO_MANY_REQUESTS);
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    //测试env环境
    @Get('test')
    testEnv(){
        return this.authService.getEnvVariables();
    }
}
