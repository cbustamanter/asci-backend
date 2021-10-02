import { Arg, Mutation, Resolver } from "type-graphql";
import { CertificateController } from "../../../controllers/intranet/certificate/CertificateController";

@Resolver()
export class CertificateResolver {
  private oCertificate = new CertificateController();
  @Mutation(() => String)
  generate(
    @Arg("performedQuizzId") performedQuizzId: string
  ): Promise<string | undefined> {
    return this.oCertificate.generate(performedQuizzId);
  }
}
