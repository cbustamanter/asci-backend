import { UseMiddleware } from "type-graphql";
import { getRepository } from "typeorm";
import { PerformedQuizz } from "../../../entities/PerformedQuizz";
import { isAuth } from "../../../middlewares/isAuth";
import { PerformedQuizzService } from "../../../services/intranet/quizz/PerformedQuizzService";

export class PerformedQuizzController implements PerformedQuizzService {
  private repo = getRepository(PerformedQuizz);

  @UseMiddleware(isAuth)
  async performQuizz(userId: string, quizzId: string): Promise<PerformedQuizz> {
    return this.repo
      .create({ quizz: { id: quizzId }, user: { id: userId } })
      .save();
  }
}
