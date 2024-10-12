import {Injectable, UnauthorizedException} from '@nestjs/common';
import {User} from './user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import {CreateUserDto} from "./dto/createUserDto";
import {v4 as uuid4} from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>, // 1.
    ) {

    }

    //创建用户
    async create(userDTO: CreateUserDto): Promise<User> {
        const user = new User();
        user.firstName = userDTO.firstName
        user.lastName = userDTO.lastName
        user.email = userDTO.email
        user.apiKey = uuid4();
        user.password = userDTO.password;

        const salt = await bcrypt.genSalt(); // 2.
        user.password = await bcrypt.hash(userDTO.password, salt); // 3.
        const savedUser = await this.userRepository.save(user); // 4.
        delete savedUser.password; // 5.
        return savedUser; // 6.
    }

    // 查找
    async fineOne(data: Partial<User>): Promise<User> {
        const {email} = data
        const user = await this.userRepository.findOneBy({email});
        console.log(user);
        if (!user) {
            throw new UnauthorizedException('用户不存在')
        }
        return user;
    }

    async findById(id: number): Promise<User> {
        return this.userRepository.findOneBy({id});
    }

    async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
        return this.userRepository.update({
            id: userId
        }, {
            twoFASecret: secret,
            enable2FA: true,
        })
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userRepository.update(
            {id: userId,}, {enable2FA: false, twoFASecret: null,})
    }

    async findByApiKey(apiKey: string): Promise<User | { msg: string }> {
        const user: User = await this.userRepository.findOneBy({apiKey});

        if (!user) {
            throw new Error('没有api 密钥')
        }

        const currentTime = Date.now();
        const timeWindow = 20 * 1000;
        const maxRequest = 5;

        if (!user.rateLimit) {
            user.rateLimit = {count: 0, lastRequest: currentTime};
        }

        if (currentTime - user.rateLimit.lastRequest > timeWindow) {
            user.rateLimit.count = 0;
            user.rateLimit.lastRequest = currentTime;
        }

        if (user.rateLimit.count >= maxRequest) {
            //自定义报错
            // throw new ApiRateLimitError();
            return {
                msg: `Api 超过次数${user.rateLimit.count},`
            }
        }

        user.rateLimit.count++
        await this.userRepository.save(user);
        return user;
    }

}