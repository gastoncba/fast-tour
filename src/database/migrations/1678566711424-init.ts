import { MigrationInterface, QueryRunner } from "typeorm";

export class init1678566711424 implements MigrationInterface {
    name = 'init1678566711424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "travel" ADD "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "travel" ADD "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "travel" DROP COLUMN "updateAt"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP COLUMN "createAt"`);
    }

}
