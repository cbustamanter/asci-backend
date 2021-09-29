import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class QuizzResult {
  @Field(() => Int)
  score: number;

  @Field(() => Boolean)
  approved: boolean;

  @Field(() => Int)
  attemptsLeft: number;
}
