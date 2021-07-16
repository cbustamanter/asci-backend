import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";

export type SessionFile = {
  filename: string;
  name: string;
  mimetype: string;
  encoding: string;
};

@InputType()
export class InputCourseSession {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Date, { nullable: true })
  startTime?: Date;

  @Field(() => Date, { nullable: true })
  endTime?: Date;

  @Field(() => String, { nullable: true })
  recordingUrl?: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  files?: [Promise<FileUpload>];

  sessionFiles: SessionFile[];
}
