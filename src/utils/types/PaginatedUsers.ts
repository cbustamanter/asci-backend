import { ObjectType, Field } from "type-graphql";
import { User } from "../../entities/User";

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  users: User[];
  @Field()
  hasMore: boolean;
}
