import { MigrationInterface, QueryRunner } from "typeorm";

export class test1678573119230 implements MigrationInterface {
    name = 'test1678573119230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "place" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "countryId" integer, CONSTRAINT "REL_4799d6b017d9beee99e6003a35" UNIQUE ("countryId"), CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "travel" DROP COLUMN "createAt"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP COLUMN "updateAt"`);
        await queryRunner.query(`ALTER TABLE "travel" ADD "placeId" integer`);
        await queryRunner.query(`ALTER TABLE "travel" ADD CONSTRAINT "UQ_4e317a32594e0273a68f32927e9" UNIQUE ("placeId")`);
        await queryRunner.query(`ALTER TABLE "travel" ADD CONSTRAINT "FK_4e317a32594e0273a68f32927e9" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "place" ADD CONSTRAINT "FK_4799d6b017d9beee99e6003a350" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP CONSTRAINT "FK_4799d6b017d9beee99e6003a350"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP CONSTRAINT "FK_4e317a32594e0273a68f32927e9"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP CONSTRAINT "UQ_4e317a32594e0273a68f32927e9"`);
        await queryRunner.query(`ALTER TABLE "travel" DROP COLUMN "placeId"`);
        await queryRunner.query(`ALTER TABLE "travel" ADD "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "travel" ADD "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`DROP TABLE "place"`);
    }

}
