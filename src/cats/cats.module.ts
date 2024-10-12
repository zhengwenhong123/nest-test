import {Module} from '@nestjs/common';
import {CatsService} from './cats.service';
import {CatsController} from "./cats.controller";
import {connection} from "../common/constatnts/connection";

//值提供者 (useValue)
const MockCatsService = {
    findAll: () => {
        return [{id: 1, name: 'test'}, {id: 2, name: 'test2'}];
    }
}


@Module({
    controllers: [CatsController],
    //值提供者
    // providers: [CatsService, {
    //     provide: CatsService,
    //     useValue: MockCatsService,
    // }]

    //非类提供者
    providers:[CatsService,{
        provide:'connection',
        useValue:connection,
    }],
})
export class CatsModule {
}
