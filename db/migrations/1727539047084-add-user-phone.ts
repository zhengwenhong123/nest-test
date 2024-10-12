import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhone1727539047084 implements MigrationInterface {
    name = 'AddUserPhone1727539047084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(255) NOT NULL`);
    }

}
