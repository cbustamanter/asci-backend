import { Arg, Mutation, Resolver } from "type-graphql";
import { PerformedQuizzController } from "../../controllers/intranet/quizz/PerformedQuizzController";
import { PerformedQuizz } from "../../entities/PerformedQuizz";

@Resolver()
export class PerformedQuizzResolver {
  private oPerformedQuizz = new PerformedQuizzController();

  @Mutation(() => PerformedQuizz)
  async performQuizz(
    @Arg("userId") userId: string,
    @Arg("quizzId") quizzId: string
  ): Promise<PerformedQuizz> {
    return this.oPerformedQuizz.performQuizz(userId, quizzId);
  }
}
