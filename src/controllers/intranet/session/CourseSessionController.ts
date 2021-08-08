import { getRepository } from "typeorm";
import { CourseSession } from "../../../entities/CourseSession";
import { CourseSessionService } from "../../../services/intranet/session/CourseSessionService";

export class CourseSessionController implements CourseSessionService {
  private repo = getRepository(CourseSession);

  courseSession(id?: string): Promise<CourseSession | undefined> {
    return this.repo
      .createQueryBuilder("cs")
      .leftJoinAndSelect("cs.courseDetail", "cd")
      .where("cs.id = :id", { id })
      .getOne();
  }
}
