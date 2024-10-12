import { Injectable } from '@nestjs/common';
import {Connection} from "mysql2";
import {DataSource} from "typeorm";
import {seedData} from "../../db/seeds/seed-data";


@Injectable()
export class SeedService {
    constructor(private readonly connection: DataSource) {

    }

    async seed(){
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction()
        try {
            const manger = queryRunner.manager;
            await seedData(manger);
            await queryRunner.commitTransaction()
        }
        catch (err){
            console.log("Error during database seeding:", err);
            await queryRunner.rollbackTransaction(); //
        }
        finally {
            await queryRunner.release();
        }
    }
}
