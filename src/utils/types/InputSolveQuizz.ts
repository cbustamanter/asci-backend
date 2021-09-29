import { Field, InputType } from "type-graphql";

@InputType()
export class InputSolvequizz {
  @Field(() => [String])
  answersIds: string[];
}
