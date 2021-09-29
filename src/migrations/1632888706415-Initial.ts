import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1632888706415 implements MigrationInterface {
    name = 'Initial1632888706415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session_file" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "name" character varying NOT NULL, "mimetype" character varying NOT NULL, "encoding" character varying NOT NULL, "courseSessionId" uuid, CONSTRAINT "PK_9b673ab70400abe6fda5e07fca9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course_session" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "recordingUrl" character varying NOT NULL, "courseDetailId" uuid, CONSTRAINT "PK_12288a725cc3c3fba4e600a0ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course_detail" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "coverPhoto" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "classUrl" character varying NOT NULL, "hasTest" boolean NOT NULL, CONSTRAINT "PK_f0d5ec5e7b230aa582c1bbb0c50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "solved_quizz" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answerId" character varying NOT NULL, "statement" character varying NOT NULL, "text" character varying NOT NULL, "isCorrect" boolean NOT NULL, "performedQuizzId" uuid, CONSTRAINT "PK_6ad734bbb21d083f5c7f5db1697" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "performed_quizz" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" smallint NOT NULL DEFAULT '1', "finalScore" integer NOT NULL DEFAULT '0', "expirationDate" TIMESTAMP NOT NULL, "quizzId" uuid, "userId" uuid, CONSTRAINT "PK_5ee916d570dcea79f60744dc01b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "names" character varying NOT NULL, "surnames" character varying NOT NULL, "password" character varying NOT NULL, "gender" smallint NOT NULL DEFAULT '1', "cellphone" character varying NOT NULL, "email" character varying NOT NULL, "status" smallint NOT NULL DEFAULT '1', "role" smallint NOT NULL DEFAULT '1', "country" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" smallint NOT NULL DEFAULT '1', "courseDetailId" uuid, CONSTRAINT "REL_a0510b0bd29e505f05ac256c05" UNIQUE ("courseDetailId"), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizz" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" smallint NOT NULL DEFAULT '1', "courseId" uuid, "quizzDetailId" uuid, CONSTRAINT "REL_57601ae6a4ba8cf3deccce3c69" UNIQUE ("courseId"), CONSTRAINT "REL_53a371b29f827ef8d1d0a55dc6" UNIQUE ("quizzDetailId"), CONSTRAINT "PK_6fbd9c6f5884207789cd89e8d00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizz_detail" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "availableTime" integer NOT NULL, "timeToComplete" integer NOT NULL, "minScore" integer NOT NULL DEFAULT '13', CONSTRAINT "PK_8552d8999f791d4da625e01032e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "statement" character varying NOT NULL, "score" integer NOT NULL, "quizzDetailId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "isCorrect" boolean NOT NULL, "questionId" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course_users_user" ("courseId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_45a90504f8137ef73ddd0a14e5a" PRIMARY KEY ("courseId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d1d16a0f75021e4fd7360a833" ON "course_users_user" ("courseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6acc61160e93efd2341268c53" ON "course_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "session_file" ADD CONSTRAINT "FK_b302ad42406eee63525debaa828" FOREIGN KEY ("courseSessionId") REFERENCES "course_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_session" ADD CONSTRAINT "FK_0184eed333f34d9393c57cfb081" FOREIGN KEY ("courseDetailId") REFERENCES "course_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solved_quizz" ADD CONSTRAINT "FK_02fe3ef7b7733ff0922ff73999b" FOREIGN KEY ("performedQuizzId") REFERENCES "performed_quizz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "performed_quizz" ADD CONSTRAINT "FK_4ce352eb69ef7cbdab90315916c" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "performed_quizz" ADD CONSTRAINT "FK_6580ea3d2b81cd660c6a4b3f7b8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_a0510b0bd29e505f05ac256c055" FOREIGN KEY ("courseDetailId") REFERENCES "course_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_57601ae6a4ba8cf3deccce3c69b" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_53a371b29f827ef8d1d0a55dc6d" FOREIGN KEY ("quizzDetailId") REFERENCES "quizz_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_6c43342d16c79f2df834e439233" FOREIGN KEY ("quizzDetailId") REFERENCES "quizz_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_users_user" ADD CONSTRAINT "FK_3d1d16a0f75021e4fd7360a8331" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_users_user" ADD CONSTRAINT "FK_c6acc61160e93efd2341268c53b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "course_users_user" DROP CONSTRAINT "FK_c6acc61160e93efd2341268c53b"`);
        await queryRunner.query(`ALTER TABLE "course_users_user" DROP CONSTRAINT "FK_3d1d16a0f75021e4fd7360a8331"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_6c43342d16c79f2df834e439233"`);
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_53a371b29f827ef8d1d0a55dc6d"`);
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_57601ae6a4ba8cf3deccce3c69b"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_a0510b0bd29e505f05ac256c055"`);
        await queryRunner.query(`ALTER TABLE "performed_quizz" DROP CONSTRAINT "FK_6580ea3d2b81cd660c6a4b3f7b8"`);
        await queryRunner.query(`ALTER TABLE "performed_quizz" DROP CONSTRAINT "FK_4ce352eb69ef7cbdab90315916c"`);
        await queryRunner.query(`ALTER TABLE "solved_quizz" DROP CONSTRAINT "FK_02fe3ef7b7733ff0922ff73999b"`);
        await queryRunner.query(`ALTER TABLE "course_session" DROP CONSTRAINT "FK_0184eed333f34d9393c57cfb081"`);
        await queryRunner.query(`ALTER TABLE "session_file" DROP CONSTRAINT "FK_b302ad42406eee63525debaa828"`);
        await queryRunner.query(`DROP INDEX "IDX_c6acc61160e93efd2341268c53"`);
        await queryRunner.query(`DROP INDEX "IDX_3d1d16a0f75021e4fd7360a833"`);
        await queryRunner.query(`DROP TABLE "course_users_user"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "quizz_detail"`);
        await queryRunner.query(`DROP TABLE "quizz"`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "performed_quizz"`);
        await queryRunner.query(`DROP TABLE "solved_quizz"`);
        await queryRunner.query(`DROP TABLE "course_detail"`);
        await queryRunner.query(`DROP TABLE "course_session"`);
        await queryRunner.query(`DROP TABLE "session_file"`);
    }

}
