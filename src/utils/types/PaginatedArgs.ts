import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PaginatedArgs {
  // @Arg("status", () => Int, { nullable: true }) status: number,
  // @Arg("search", () => String, { nullable: true }) search: string,
  // @Arg("page", () => Int) page: number,
  // @Arg("per_page", () => Int, { nullable: true }) per_page: number
  @Field(() => Int, { nullable: true })
  status: number;

  @Field(() => String, { nullable: true })
  search: string;

  @Field(() => Int)
  page: number;

  @Field(() => Int, { nullable: true })
  per_page: number;
}
