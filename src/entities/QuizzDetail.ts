import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, OneToOne } from "typeorm";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { Question } from "./Question";
import { Quizz } from "./Quizz";

@ObjectType()
@Entity()
export class QuizzDetail extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field()
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  availableTime: number;

  @Field(() => Int)
  @Column()
  timeToComplete: number;

  @Field(() => Int)
  @Column({ default: 13 })
  minScore: number;

  @Field(() => Quizz)
  @OneToOne(() => Quizz, (quizz) => quizz.quizzDetail)
  quizz: Quizz;

  @Field(() => [Question])
  @OneToMany(() => Question, (questions) => questions.quizzDetail, {
    cascade: ["insert", "update"],
  })
  questions: Question[];
}
