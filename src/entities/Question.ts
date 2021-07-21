import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Answer } from "./Answer";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { QuizzDetail } from "./QuizzDetail";

@ObjectType()
@Entity()
export class Question extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field()
  @Column()
  statement: string;

  @Field(() => Int)
  @Column()
  score: number;

  @Field(() => [Answer], { nullable: true })
  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: ["insert", "update"],
  })
  answers: Answer[];

  @Field(() => QuizzDetail)
  @ManyToOne(() => QuizzDetail, (quizzDetail) => quizzDetail.questions)
  quizzDetail: QuizzDetail;
}
