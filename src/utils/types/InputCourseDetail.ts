import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";

@InputType()
export class InputCourseDetail {
  @Field()
  hasTest: boolean;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String)
  startDate: Date;

  @Field(() => String)
  endDate: Date;

  @Field()
  classUrl: string;

  @Field(() => GraphQLUpload)
  coverPhoto: Promise<FileUpload>;
}
