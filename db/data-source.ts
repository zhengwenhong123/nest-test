import {DataSource, DataSourceOptions} from 'typeorm';
import {TypeOrmModule, TypeOrmModuleAsyncOptions} from "@nestjs/typeorm"
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as process from "node:process";

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configServer: ConfigService): Promise<TypeOrmModule> => {
        return {
            type: 'mysql',
            host: configServer.get<string>('dbHost'),
            port: configServer.get<string>('port'),
            username: configServer.get<string>('username'),
            password: configServer.get<string>('password'),
            database: configServer.get<string>('dbName'),
            entities: ['dist/**/*.entity{.js}'],
            synchronize: false,
            migrationsDir: ['dist/db/migrations/*.js'],
        }
    }
}


export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.USERNAMES,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity.js'], //1
    synchronize: false, // 2
    migrations: ['dist/db/migrations/*.js'],// 3
};

const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;