import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { Quizz } from "./Quizz";
import { SolvedQuizz } from "./SolvedQuizz";
import { User } from "./User";

@ObjectType()
@Entity()
export class PerformedQuizz extends EntityWithBase(
  EntityWithDates(BaseEntity)
) {
  @Field(() => Quizz)
  @ManyToOne(() => Quizz, (quizz) => quizz.performedQuizz)
  @JoinColumn()
  quizz: Quizz;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.performedQuizz)
  user: User;

  @Field(() => Int)
  @Column({ type: "smallint", default: 1 })
  status: number; //1:started 2:finished

  @Field(() => Int)
  @Column({ default: 0 })
  finalScore: number; //1:started 2:finished

  @Field(() => String)
  @Column()
  expirationDate: Date;

  @Field(() => [SolvedQuizz])
  @OneToMany(() => SolvedQuizz, (solved) => solved.performedQuizz)
  solved: SolvedQuizz[];
}
