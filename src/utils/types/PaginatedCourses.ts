import { Field, Int, ObjectType } from "type-graphql";
import { Course } from "../../entities/Course";

@ObjectType()
export class PaginatedCourses {
  @Field(() => Int, { nullable: true })
  prev: number | null;

  @Field(() => [Course])
  data: Course[];

  @Field(() => Int)
  totalPages: number;
}
