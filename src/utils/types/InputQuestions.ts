import { Field, InputType, Int } from "type-graphql";
import { InputAnswers } from "./InputAnswers";

@InputType()
export class InputQuestion {
  @Field({ nullable: true })
  id?: string;

  @Field()
  statement: string;

  @Field(() => Int)
  score: number;

  @Field(() => [InputAnswers], { nullable: "itemsAndList" })
  answers?: InputAnswers[];
}
