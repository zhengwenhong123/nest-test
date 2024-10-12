import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        //获取到角色信息
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        // 查看请求
        const request = context.switchToHttp().getRequest();
        // 查看当前授权的角色
        const user = request.user;
        console.log(user)
        //判断是否有 管理员 admin 账号的权限 
        const hasRole = () =>
            user.roles.some(role => !!roles.find(item => item === role));

        return user && user.roles && hasRole();
    }
}