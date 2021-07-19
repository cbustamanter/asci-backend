import { Field, ObjectType } from "type-graphql";
import { Course } from "../../entities/Course";
import { PaginatedResponse } from "./PaginatedResponse";

@ObjectType()
export class PaginatedCourses extends PaginatedResponse {
  @Field(() => [Course])
  data: Course[];
}
