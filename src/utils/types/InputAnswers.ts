import { Field, InputType } from "type-graphql";

@InputType()
export class InputAnswers {
  @Field({ nullable: true })
  id?: string;

  @Field()
  text: string;

  @Field(() => Boolean)
  isCorrect: boolean;
}
