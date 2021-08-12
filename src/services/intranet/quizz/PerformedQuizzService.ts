import { PerformedQuizz } from "../../../entities/PerformedQuizz";

export interface PerformedQuizzService {
  performQuizz: (userId: string, quizzId: string) => Promise<PerformedQuizz>;
}
