import { Field, InputType, Int } from "type-graphql";
import { InputQuestion } from "./InputQuestions";

@InputType()
export class InputQuizz {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field(() => Int)
  availableTime: number;

  @Field(() => Int)
  timeToComplete: number;

  @Field(() => [InputQuestion], { nullable: "itemsAndList" })
  questions?: InputQuestion[];
}
