import {Reflector} from "@nestjs/core";

// 获取到 账号角色
export const Roles = Reflector.createDecorator<string[]>()