import { ObjectType, Field, Int } from "type-graphql";
import { User } from "../../entities/User";

@ObjectType()
export class PaginatedUsers {
  @Field(() => Int, { nullable: true })
  prev: number | null;

  @Field(() => [User])
  data: User[];

  @Field(() => Int)
  totalPages: number;
}
