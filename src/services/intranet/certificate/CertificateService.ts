import { MyContext } from "../../../types";

export interface CertificateService {
  generate: (performedQuizz: string) => Promise<string>;
  generateWithoutTest: (
    { req }: MyContext,
    courseId: string
  ) => Promise<string>;
  userCertificate: (
    { req }: MyContext,
    courseId: string
  ) => Promise<string | undefined>;
}
