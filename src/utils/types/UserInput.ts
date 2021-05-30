import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UserInput {
  @Field({ nullable: true })
  names?: string;

  @Field({ nullable: true })
  surnames?: string;

  @Field(() => Int, { nullable: true })
  gender?: number;

  @Field({ nullable: true })
  cellphone?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  password?: string;
}
