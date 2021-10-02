import puppeteer from "puppeteer";
import { getRepository } from "typeorm";
import { AWSS3Uploader } from "../../../classes/AWSS3Uploader";
import { S3_BUCKET, S3_PDF_PATH } from "../../../constants";
import { PerformedQuizz } from "../../../entities/PerformedQuizz";
import { UserCertificate } from "../../../entities/UserCertificate";
import { CertificateService } from "../../../services/intranet/certificate/CertificateService";
import { CertificateTmpl } from "../../../utils/templates/CertificateTmpl";

export class CertificateController implements CertificateService {
  private repo = getRepository(UserCertificate);
  private performedQuizz = getRepository(PerformedQuizz);
  private uploader = new AWSS3Uploader(`${S3_BUCKET}${S3_PDF_PATH}`);
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
    const studentName = `${result[0].u_names} ${result[0].u_surnames}`;
    const tmpl = CertificateTmpl({
      studentName,
      courseName: result[0].cd_name,
      courseStartDate: result[0].cd_startDate,
      courseEndDate: result[0].cd_endDate,
      totalSessions: result.length + 1,
    });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(tmpl);
    await page.emulateMediaType("screen");
    const stream = await page.createPDFStream({
      landscape: true,
      printBackground: true,
    });
    const { Location } = await this.uploader.generatePdf(
      `${certificate.id}.pdf`,
      stream
    );
    await browser.close();
    return Location;
  }
}
