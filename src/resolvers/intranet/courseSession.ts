import {
  Arg,
  FieldResolver,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { CourseSessionController } from "../../controllers/intranet/session/CourseSessionController";
import { CourseSession } from "../../entities/CourseSession";
import { SessionStatus } from "./course";

@ObjectType()
@Resolver(CourseSession)
export class IntranetSessionResolver {
  private oSession = new CourseSessionController();

  @FieldResolver(() => SessionStatus)
  condition(@Root() session: CourseSession): SessionStatus {
    const now = new Date();
    const startDate = session.startTime;
    let status = 4;
    // let text = startDate.toISOString();
    let text = "";
    if (now > startDate) {
      status = 1;
      text = "Finalizada";
    }
    if (now.getDate() == startDate.getDate()) {
      //  if its on session start date and now time
      if (now.getTime() > startDate.getTime()) {
        status = 2;
        text = "Sesión Iniciada";
      } else {
        const leftTime = startDate.getTime() - now.getTime();
        const leftTimeHrs = Math.round(leftTime / 1000 / 60 / 60); // ms to hrs.
        status = 3;
        text = `Inicia en ${leftTimeHrs} hrs`;
      }
    }
    return { status, text };
  }

  @Query(() => CourseSession, { nullable: true })
  session(
    @Arg("id", { nullable: true }) id: string
  ): Promise<CourseSession | undefined> {
    return this.oSession.courseSession(id);
  }
}
