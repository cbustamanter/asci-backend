import {MigrationInterface, QueryRunner} from "typeorm";

export class userCertificateCols1634158419100 implements MigrationInterface {
    name = 'userCertificateCols1634158419100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_certificate" DROP CONSTRAINT "FK_4db3a5aca2a8b0be4e8d86bc93f"`);
        await queryRunner.query(`ALTER TABLE "user_certificate" DROP CONSTRAINT "FK_aef88fe7bffa6263d74562cc219"`);
        await queryRunner.query(`ALTER TABLE "user_certificate" DROP CONSTRAINT "UQ_4db3a5aca2a8b0be4e8d86bc93f"`);
        await queryRunner.query(`ALTER TABLE "user_certificate" DROP CONSTRAINT "UQ_aef88fe7bffa6263d74562cc219"`);
        await queryRunner.query(`ALTER TABLE "user_certificate" ADD CONSTRAINT "FK_4db3a5aca2a8b0be4e8d86bc93f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_certificate" ADD CONSTRAINT "FK_aef88fe7bffa6263d74562cc219" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_certificate" DROP CONSTRAINT "FK_aef88fe7bffa6263d74562cc219"`);
        await queryRunner.query(`ALTER TABLE "user_certificate" DROP CONSTRAINT "FK_4db3a5aca2a8b0be4e8d86bc93f"`);
        await queryRunner.query(`ALTER TABLE "user_certificate" ADD CONSTRAINT "UQ_aef88fe7bffa6263d74562cc219" UNIQUE ("courseId")`);
        await queryRunner.query(`ALTER TABLE "user_certificate" ADD CONSTRAINT "UQ_4db3a5aca2a8b0be4e8d86bc93f" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_certificate" ADD CONSTRAINT "FK_aef88fe7bffa6263d74562cc219" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_certificate" ADD CONSTRAINT "FK_4db3a5aca2a8b0be4e8d86bc93f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
