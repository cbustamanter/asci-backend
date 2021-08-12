import { Course } from "../../../entities/Course";

export interface CourseService {
  course: (courseId: String) => Promise<Course>;
}
