import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";

export type SessionFile = {
  filename: string;
};

@InputType()
export class InputCourseSession {
  @Field(() => String)
  name!: string;

  @Field(() => Date)
  startTime!: Date;

  @Field(() => Date)
  endTime!: Date;

  @Field(() => String)
  recordingUrl: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  files: [Promise<FileUpload>];

  sessionFiles: SessionFile[];
}
