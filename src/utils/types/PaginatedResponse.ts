import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class PaginatedResponse {
  @Field(() => Int, { nullable: true })
  prev: number | null;
  @Field(() => Int)
  totalPages: number;
}
