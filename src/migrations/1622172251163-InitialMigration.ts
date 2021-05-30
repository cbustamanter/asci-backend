import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1622172251163 implements MigrationInterface {
    name = 'InitialMigration1622172251163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "names" character varying NOT NULL, "surnames" character varying NOT NULL, "password" character varying NOT NULL, "gender" integer NOT NULL, "cellphone" character varying NOT NULL, "email" character varying NOT NULL, "status" smallint NOT NULL DEFAULT '1', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
