import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CertificateController } from "../../../controllers/intranet/certificate/CertificateController";
import { MyContext } from "../../../types";

@Resolver()
export class CertificateResolver {
  private oCertificate = new CertificateController();
  @Mutation(() => String)
  generate(
    @Arg("performedQuizzId") performedQuizzId: string
  ): Promise<string | undefined> {
    return this.oCertificate.generate(performedQuizzId);
  }

  @Query(() => String, { nullable: true })
  userCertificate(
    @Ctx() ctx: MyContext,
    @Arg("courseId") courseId: string
  ): Promise<string | undefined> {
    return this.oCertificate.userCertificate(ctx, courseId);
  }

  @Mutation(() => String)
  generateWithoutTest(
    @Ctx() ctx: MyContext,
    @Arg("courseId") courseId: string
  ): Promise<string | undefined> {
    return this.oCertificate.generateWithoutTest(ctx, courseId);
  }
}
