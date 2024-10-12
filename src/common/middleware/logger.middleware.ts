/**
 *  自定义中间件
 *  可以自定义拦截器
 * */

import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('...Request');
        // 请求类型
        console.log(req.method.toUpperCase());
        next();
    }
}

/**
 *  函数式中间件
 * */
export const logger = (req:Request,res:Response,next:NextFunction) => {
    console.log('...Request');
    next();
}