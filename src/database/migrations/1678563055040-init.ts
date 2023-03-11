import { MigrationInterface, QueryRunner } from "typeorm";

export class init1678563055040 implements MigrationInterface {
    name = 'init1678563055040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "travel" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_657b63ec7adcf2ecf757a490a67" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "travel"`);
    }

}
