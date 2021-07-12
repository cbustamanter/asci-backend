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

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;

  @Field()
  classUrl: string;

  @Field(() => GraphQLUpload)
  coverPhoto: Promise<FileUpload>;
}
