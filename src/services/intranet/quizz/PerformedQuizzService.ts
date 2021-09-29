import { PerformedQuizz } from "../../../entities/PerformedQuizz";
import { MyContext } from "../../../types";
import { InputSolvequizz } from "../../../utils/types/InputSolveQuizz";
import { QuizzResult } from "../../../utils/types/QuizzResult";

export interface PerformedQuizzService {
  performQuizz: (userId: string, quizzId: string) => Promise<PerformedQuizz>;
  performedQuizz: (id: string) => Promise<PerformedQuizz>;
  solveQuizz: (
    id: string,
    input: InputSolvequizz,
    { req }: MyContext
  ) => Promise<QuizzResult>;
  userQuizzes: ({ req }: MyContext) => Promise<PerformedQuizz[]>;
}
