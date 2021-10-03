import { getRepository } from "typeorm";
import { Course } from "../../../entities/Course";
import { CourseService } from "../../../services/intranet/course/CourseService";
import { MyContext } from "../../../types";
import { userCourseSelect } from "./Selections";

export class CourseController implements CourseService {
  private courseRepo = getRepository(Course);

  async course(courseId: String, { req }: MyContext): Promise<Course> {
    console.log(`probando aca`, req.session.userId);
    const result = await this.courseRepo
      .createQueryBuilder("c")
      .select(userCourseSelect)
      .leftJoin("c.quizz", "q")
      .leftJoin("q.performedQuizz", "pf", "pf.userId = :userId", {
        userId: req.session.userId,
      })
      .leftJoin("q.quizzDetail", "qd")
      .leftJoin("c.courseDetail", "cd")
      .leftJoin("cd.courseSessions", "cs")
      .leftJoin("cs.courseSessionFiles", "f")
      .where("c.id = :id", { id: courseId })
      .orderBy("cs.createdAt", "ASC")
      .getOneOrFail();
    return result;
  }
}
