import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { PerformedQuizz } from "./PerformedQuizz";

@ObjectType()
@Entity()
export class SolvedQuizz extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field()
  @Column()
  answerId: string;

  @Field()
  @Column()
  statement: string;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column()
  isCorrect: boolean;

  @ManyToOne(() => PerformedQuizz, (performedQuizz) => performedQuizz.solved)
  performedQuizz: PerformedQuizz;
}
