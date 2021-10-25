import puppeteer from "puppeteer";
import { getRepository } from "typeorm";
import { AWSS3Uploader } from "../../../classes/AWSS3Uploader";
import { S3_BUCKET, S3_PDF_PATH } from "../../../constants";
import { Course } from "../../../entities/Course";
import { PerformedQuizz } from "../../../entities/PerformedQuizz";
import { User } from "../../../entities/User";
import { UserCertificate } from "../../../entities/UserCertificate";
import { CertificateService } from "../../../services/intranet/certificate/CertificateService";
import { MyContext } from "../../../types";
import {
  CertificateContent,
  CertificateTmpl,
} from "../../../utils/templates/CertificateTmpl";

export class CertificateController implements CertificateService {
  private repo = getRepository(UserCertificate);
  private user = getRepository(User);
  private course = getRepository(Course);
  private performedQuizz = getRepository(PerformedQuizz);
  private uploader = new AWSS3Uploader(`${S3_BUCKET}${S3_PDF_PATH}`);

  async userCertificate(
    { req }: MyContext,
    courseId: string
  ): Promise<string | undefined> {
    const userCertificate = await this.repo.findOne({
      where: { user: { id: req.session.userId }, course: { id: courseId } },
    });
    if (!userCertificate) return;
    return `${userCertificate.id}.pdf`;
  }

  async generateWithoutTest(
    { req }: MyContext,
    courseId: string
  ): Promise<string> {
    const user = await this.user.findOneOrFail({ id: req.session.userId });
    const course = await this.course.findOneOrFail(
      { id: courseId },
      { relations: ["courseDetail", "courseDetail.courseSessions"] }
    );
    const certificate = await this.repo.create({ user, course }).save();
    const tmpl = await this.createCertificateTmpl({
      studentName: await this.fullName(user.names, user.surnames),
      courseName: course.courseDetail.name,
      courseStartDate: course.courseDetail.startDate,
      courseEndDate: course.courseDetail.endDate,
      totalSessions: course.courseDetail.courseSessions.length,
    });
    return await this.createPdf(tmpl, certificate.id);
  }

  async generate(performedQuizzId: string): Promise<string> {
    const result = await this.performedQuizz
      .createQueryBuilder("pq")
      .select([
        "u.id",
        "u.names",
        "u.surnames",
        "c.id",
        "cd.name",
        "cd.startDate",
        "cd.endDate",
        "cs.id",
      ])
      .leftJoin("pq.user", "u")
      .leftJoin("pq.quizz", "q")
      .leftJoin("q.course", "c")
      .leftJoin("c.courseDetail", "cd")
      .leftJoin("cd.courseSessions", "cs")
      .where("pq.id = :id", { id: performedQuizzId })
      .getRawMany();
    const certificate = await this.repo
      .create({ user: { id: result[0].u_id }, course: { id: result[0].c_id } })
      .save();
    const studentName = await this.fullName(
      result[0].u_names,
      result[0].u_surnames
    );

    const tmpl = await this.createCertificateTmpl({
      studentName,
      courseName: result[0].cd_name,
      courseStartDate: result[0].cd_startDate,
      courseEndDate: result[0].cd_endDate,
      totalSessions: result.length,
    });
    return await this.createPdf(tmpl, certificate.id);
  }

  private async fullName(names: string, surnames: string): Promise<string> {
    return `${names} ${surnames}`;
  }
  private async createCertificateTmpl(
    content: CertificateContent
  ): Promise<string> {
    return CertificateTmpl(content);
  }
  private async createPdf(
    tmpl: string,
    certificateId: string
  ): Promise<string> {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(tmpl);
    await page.emulateMediaType("screen");
    const stream = await page.createPDFStream({
      height: "1132px",
      width: "779px",
      landscape: true,
      printBackground: true,
    });
    const { Location } = await this.uploader.generatePdf(
      `${certificateId}.pdf`,
      stream
    );
    await browser.close();
    return Location;
  }
}
