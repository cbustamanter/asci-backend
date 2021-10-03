import moment from "moment";
import {
  Arg,
  Ctx,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { CourseController } from "../../controllers/intranet/course/CourseController";
import { Course } from "../../entities/Course";
import { isAuth } from "../../middlewares/isAuth";
import { MyContext } from "../../types";

@ObjectType()
export class SessionStatus {
  @Field()
  text: string;

  @Field(() => Int)
  status: number;
}
moment.locale("es");
@Resolver(Course)
export class IntranetCourseResolver {
  private oCourse = new CourseController();

  @UseMiddleware(isAuth)
  @Query(() => Course)
  async userCourse(
    @Arg("courseId") courseId: string,
    @Ctx() ctx: MyContext
  ): Promise<Course> {
    return this.oCourse.course(courseId, ctx);
  }
}
