import { InputType, Field } from "type-graphql";

@InputType()
export class SessionFileType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  filename?: string;

  @Field(() => String, { nullable: true })
  mimetype?: string;

  @Field(() => String, { nullable: true })
  encoding?: string;
}
