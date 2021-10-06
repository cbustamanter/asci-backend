import moment from "moment";
import { getRepository, MoreThanOrEqual } from "typeorm";
import { S3_PDF_PATH, S3_URL } from "../../../constants";
import { PerformedQuizz } from "../../../entities/PerformedQuizz";
import { Quizz } from "../../../entities/Quizz";
import { SolvedQuizz } from "../../../entities/SolvedQuizz";
import { UserCertificate } from "../../../entities/UserCertificate";
import { PerformedQuizzService } from "../../../services/intranet/quizz/PerformedQuizzService";
import { MyContext } from "../../../types";
import { InputSolvequizz } from "../../../utils/types/InputSolveQuizz";
import { QuizzResult } from "../../../utils/types/QuizzResult";

export class PerformedQuizzController implements PerformedQuizzService {
  private repo = getRepository(PerformedQuizz);
  private quizz = getRepository(Quizz);
  private solvedQuizz = getRepository(SolvedQuizz);
  private certificate = getRepository(UserCertificate);

  async performQuizz(userId: string, quizzId: string): Promise<PerformedQuizz> {
    const quizz = await this.quizz.findOneOrFail(
      { id: quizzId },
      { relations: ["quizzDetail"] }
    );
    await this.repo.update(
      { user: { id: userId }, quizz: { id: quizzId } },
      { status: 2 }
    );

    const expirationDate = moment()
      .add(quizz.quizzDetail.timeToComplete, "minutes")
      .toDate();

    return this.repo
      .create({ quizz: { id: quizzId }, user: { id: userId }, expirationDate })
      .save();
  }

  async performedQuizz(id: string): Promise<PerformedQuizz> {
    const result = await this.repowithRelations
      .where("p.id = :id", { id })
      .getOneOrFail();
    const now = moment().toDate();
    if (now > result.expirationDate && result.status == 1) {
      result.status = 2;
      await result.save();
      throw new Error("reload");
    }
    return result;
  }
  async certificateUrl(id: string): Promise<string | undefined> {
    const {
      user,
      quizz: { course },
    } = await this.repo.findOneOrFail(
      { id },
      { relations: ["quizz", "quizz.course", "user"] }
    );
    const result = await this.certificate.findOne({ user, course });
    if (!result) {
      return;
    }
    return `${S3_URL}${S3_PDF_PATH}/${result.id}.pdf`;
  }
  async hasAnyApproved(id: string): Promise<boolean> {
    const pq = await this.repowithRelations
      .leftJoinAndSelect("p.user", "u")
      .where("p.id = :id", { id })
      .getOneOrFail();
    const count = await this.repo.count({
      user: { id: pq.user.id },
      quizz: { id: pq.quizz.id },
      finalScore: MoreThanOrEqual(pq.quizz.quizzDetail.minScore),
    });
    return !!count;
  }
  async solveQuizz(
    id: string,
    input: InputSolvequizz,
    { req }: MyContext
  ): Promise<QuizzResult> {
    const maxAttempts = 3;
    let score = 0;
    const qb = this.repowithRelations.where("p.id = :id", { id });
    if (input.answersIds.length) {
      qb.andWhere("a.id IN (:...answerIds)", { answerIds: input.answersIds });
    }
    const result = await qb.getOneOrFail();
    const quizzId = result.quizz.id;
    const attempts = await this.repo.count({
      where: { user: { id: req.session.userId }, quizz: { id: quizzId } },
    });
    if (attempts > maxAttempts) {
      throw new Error("Max attempts 3");
    }
    const minScore = result.quizz.quizzDetail.minScore;
    if (input.answersIds.length) {
      await Promise.all(
        result.quizz.quizzDetail.questions.map(async (q) => {
          const answer = q.answers[0];
          if (answer.isCorrect) {
            score = score + q.score;
          }
          await this.solvedQuizz
            .create({
              answerId: answer.id,
              text: answer.text,
              isCorrect: answer.isCorrect,
              statement: q.statement,
              performedQuizz: { id },
            })
            .save();
        })
      );
    }
    await this.repo.update({ id }, { finalScore: score, status: 2 });
    const approved = score >= minScore ? true : false;
    return { score, approved, attemptsLeft: maxAttempts - attempts };
  }
  async userQuizzes({ req }: MyContext): Promise<PerformedQuizz[]> {
    return this.repowithRelations
      .where("p.userId = :userId", { userId: req.session.userId })
      .orderBy("p.createdAt", "DESC")
      .getMany();
  }
  get repowithRelations() {
    return this.repo
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.quizz", "q")
      .leftJoinAndSelect("q.performedQuizz", "pq")
      .leftJoinAndSelect("q.quizzDetail", "qd")
      .leftJoinAndSelect("q.course", "c")
      .leftJoinAndSelect("c.courseDetail", "cd")
      .leftJoinAndSelect("qd.questions", "qu")
      .leftJoinAndSelect("qu.answers", "a");
  }
}
