import { Field, ObjectType } from "type-graphql";
import { User } from "../../entities/User";
import { PaginatedResponse } from "./PaginatedResponse";

@ObjectType()
export class PaginatedUsers extends PaginatedResponse {
  @Field(() => [User])
  data: User[];
}
