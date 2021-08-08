import { Arg, ObjectType, Query } from "type-graphql";
import { CourseSessionController } from "../../controllers/intranet/session/CourseSessionController";
import { CourseSession } from "../../entities/CourseSession";

@ObjectType()
export class IntranetSessionResolver {
  private oSession = new CourseSessionController();

  @Query(() => CourseSession, { nullable: true })
  session(
    @Arg("id", { nullable: true }) id: string
  ): Promise<CourseSession | undefined> {
    return this.oSession.courseSession(id);
  }
}
