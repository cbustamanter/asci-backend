import { Course } from "../../../entities/Course";
import { MyContext } from "../../../types";

export interface CourseService {
  course: (courseId: String, { req }: MyContext) => Promise<Course>;
}
