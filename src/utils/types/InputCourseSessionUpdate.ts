import { Field, InputType } from "type-graphql";
import { InputCourseSession } from "./InputCourseSession";
import { SessionFileType } from "./SessionFileType";

@InputType()
export class InputCourseSessionUpdate extends InputCourseSession {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => [SessionFileType], { nullable: true })
  courseSessionFiles?: SessionFileType[];
}
