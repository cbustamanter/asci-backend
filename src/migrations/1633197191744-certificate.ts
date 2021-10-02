import {MigrationInterface, QueryRunner} from "typeorm";

export class certificate1633197191744 implements MigrationInterface {
    name = 'certificate1633197191744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_certificate" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_52423baef0f83116cd08ad6a61a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_certificate"`);
    }

}
