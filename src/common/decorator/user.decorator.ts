import {createParamDecorator, ExecutionContext} from '@nestjs/common';

// 自定义装饰器
export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
})
