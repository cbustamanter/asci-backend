import { Field, ObjectType } from "type-graphql";
import { Quizz } from "../../entities/Quizz";
import { PaginatedResponse } from "./PaginatedResponse";

@ObjectType()
export class PaginatedQuizzes extends PaginatedResponse {
  @Field(() => [Quizz])
  data: Quizz[];
}
