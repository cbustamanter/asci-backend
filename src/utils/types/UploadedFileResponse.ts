import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class UploadedFileResponse {
  @Field(() => String)
  filename: string;
  @Field(() => String)
  name: string;
  @Field(() => String)
  mimetype: string;
  @Field(() => String)
  encoding: string;
  @Field(() => String)
  url: string;
}
