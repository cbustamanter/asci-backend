import { CourseDetail } from "../../../entities/CourseDetail";

export interface CourseService {
  course: (courseId: String) => Promise<CourseDetail>;
}
