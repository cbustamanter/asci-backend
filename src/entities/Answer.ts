import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { Question } from "./Question";

@ObjectType()
@Entity()
export class Answer extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field()
  @Column()
  text: string;

  @Field(() => Boolean)
  @Column()
  isCorrect: boolean;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.answers, {
    cascade: ["insert", "update"],
  })
  question: Question;
}
