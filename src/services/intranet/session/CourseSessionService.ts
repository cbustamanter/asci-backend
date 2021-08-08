import { CourseSession } from "../../../entities/CourseSession";

export interface CourseSessionService {
  courseSession: (id?: string) => Promise<CourseSession | undefined>;
}
