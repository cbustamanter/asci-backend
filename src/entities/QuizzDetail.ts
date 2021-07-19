import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany } from "typeorm";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { Question } from "./Question";

@ObjectType()
@Entity()
export class QuizzDetail extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field()
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  endDate: Date;

  @Field()
  @Column()
  timeToComplete: string;

  @Field(() => [Question])
  @OneToMany(() => Question, (questions) => questions.quizzDetail, {
    cascade: ["insert"],
  })
  questions: Question[];
}
