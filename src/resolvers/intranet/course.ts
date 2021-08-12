import moment from "moment";
import {
  Arg,
  Field,
  FieldResolver,
  Int,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { CourseController } from "../../controllers/intranet/course/CourseController";
import { Course } from "../../entities/Course";
import { CourseDetail } from "../../entities/CourseDetail";
import { CourseSession } from "../../entities/CourseSession";
import { isAuth } from "../../middlewares/isAuth";

@ObjectType()
export class SessionStatus {
  @Field()
  text: string;

  @Field(() => Int)
  status: number;
}
moment.locale("es");
@Resolver(CourseSession)
export class IntranetCourseResolver {
  private oCourse = new CourseController();

  @FieldResolver(() => SessionStatus)
  condition(@Root() session: CourseSession): SessionStatus {
    const now = new Date();
    const startDate = session.startTime;
    let status = 4;
    let text = moment(startDate.toISOString()).format("dddd HH:ss");
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

  @UseMiddleware(isAuth)
  @Query(() => Course)
  async userCourse(@Arg("courseId") courseId: string): Promise<Course> {
    return this.oCourse.course(courseId);
  }
}
