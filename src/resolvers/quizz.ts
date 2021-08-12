import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { getRepository } from "typeorm";
import { Quizz } from "../entities/Quizz";
import { QuizzDetail } from "../entities/QuizzDetail";
import { InputQuizz } from "../utils/types/InputQuizz";
import { PaginatedArgs } from "../utils/types/PaginatedArgs";
import { PaginatedQuizzes } from "../utils/types/PaginatedQuizzes";

//TODO: make a utilty to paginate
@Resolver(Quizz)
export class QuizResolver {
  private repo = getRepository(Quizz);
  private quizzDetailrepo = getRepository(QuizzDetail);

  @FieldResolver(() => String)
  statusText(@Root() quizz: Quizz) {
    return quizz.status === 1 ? "Activo" : "Inactivo";
  }

  @Mutation(() => Boolean)
  async updateQuizz(@Arg("args") args: InputQuizz): Promise<boolean> {
    const quizz = await this.repoWithRelations()
      .where("q.id = :id", { id: args.id })
      .getOneOrFail();
    if (quizz.quizzDetail) {
      await this.quizzDetailrepo.save({
        ...quizz.quizzDetail,
        description: args.description,
        availableTime: args.availableTime,
        timeToComplete: args.timeToComplete,
        minScore: args.minScore,
        questions: args.questions,
      });
    } else {
      await this.quizzDetailrepo
        .create({
          quizz: { id: args.id },
          description: args.description,
          availableTime: args.availableTime,
          timeToComplete: args.timeToComplete,
          minScore: args.minScore,
          questions: args.questions,
        })
        .save();
    }

    return true;
  }

  @Query(() => PaginatedQuizzes)
  async quizzes(
    @Arg("args", () => PaginatedArgs) args: PaginatedArgs
  ): Promise<PaginatedQuizzes> {
    const repo = this.repoWithRelations();
    const take = args.per_page || 10;
    const skip = (args.page - 1) * take;
    const qb = repo.orderBy("q.createdAt", "DESC").take(take).skip(skip);
    if (args.status && args.status !== 0) {
      qb.andWhere("q.status = :status", { status: args.status });
    }
    if (args.search) {
      qb.andWhere("LOWER(cd.name) like :search", {
        search: `%${args.search}%`,
      });
    }
    const [data, total] = await qb.getManyAndCount();
    return {
      prev: args.page > 1 ? args.page - 1 : null,
      data: data,
      totalPages: Math.ceil(total / take),
    };
  }

  @Query(() => Quizz)
  async quizz(@Arg("id") id: string): Promise<Quizz> {
    return this.repoWithRelations()
      .orderBy({
        "qn.createdAt": "ASC",
        "a.createdAt": "ASC",
      })
      .where("q.id = :id", { id })
      .getOneOrFail();
  }

  repoWithRelations() {
    return this.repo
      .createQueryBuilder("q")
      .leftJoinAndSelect("q.course", "c")
      .leftJoinAndSelect("c.courseDetail", "cd")
      .leftJoinAndSelect("q.quizzDetail", "qd")
      .leftJoinAndSelect("qd.questions", "qn")
      .leftJoinAndSelect("qn.answers", "a");
  }
}
