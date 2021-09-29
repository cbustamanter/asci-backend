import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { PerformedQuizzController } from "../../controllers/intranet/quizz/PerformedQuizzController";
import { PerformedQuizz } from "../../entities/PerformedQuizz";
import { Quizz } from "../../entities/Quizz";
import { isAuth } from "../../middlewares/isAuth";
import { MyContext } from "../../types";
import { InputSolvequizz } from "../../utils/types/InputSolveQuizz";
import { QuizzResult } from "../../utils/types/QuizzResult";

@Resolver(Quizz)
export class PerformedQuizzResolver {
  private oPerformedQuizz = new PerformedQuizzController();

  @FieldResolver(() => Int)
  attemptsLeft(@Root() quizz: Quizz) {
    const maxAttempts = 3;
    const performedQuizzes = quizz.performedQuizz.length;
    return maxAttempts - performedQuizzes;
  }
  @UseMiddleware(isAuth)
  @Mutation(() => PerformedQuizz)
  async performQuizz(
    @Arg("userId") userId: string,
    @Arg("quizzId") quizzId: string
  ): Promise<PerformedQuizz> {
    return this.oPerformedQuizz.performQuizz(userId, quizzId);
  }

  @UseMiddleware(isAuth)
  @Query(() => PerformedQuizz)
  async performedQuizz(@Arg("id") id: string): Promise<PerformedQuizz> {
    return this.oPerformedQuizz.performedQuizz(id);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => QuizzResult)
  async solveQuizz(
    @Arg("id") id: string,
    @Arg("input", () => InputSolvequizz) input: InputSolvequizz,
    @Ctx() ctx: MyContext
  ): Promise<QuizzResult> {
    return this.oPerformedQuizz.solveQuizz(id, input, ctx);
  }

  @UseMiddleware(isAuth)
  @Query(() => [PerformedQuizz])
  async userQuizzes(@Ctx() ctx: MyContext): Promise<PerformedQuizz[]> {
    return this.oPerformedQuizz.userQuizzes(ctx);
  }
}
