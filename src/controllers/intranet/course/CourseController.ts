import { getRepository } from "typeorm";
import { Course } from "../../../entities/Course";
import { CourseDetail } from "../../../entities/CourseDetail";
import { CourseService } from "../../../services/intranet/course/CourseService";
import { userCourseSelect } from "./Selections";

export class CourseController implements CourseService {
  private courseRepo = getRepository(Course);

  async course(courseId: String): Promise<CourseDetail> {
    const result = await this.courseRepo
      .createQueryBuilder("c")
      .select(userCourseSelect)
      .leftJoin("c.courseDetail", "cd")
      .leftJoin("cd.courseSessions", "cs")
      .leftJoin("cs.courseSessionFiles", "f")
      .where("c.id = :id", { id: courseId })
      .orderBy("cs.createdAt", "ASC")
      .getOneOrFail();
    return result.courseDetail;
  }
}
