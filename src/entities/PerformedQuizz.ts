import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, JoinColumn, ManyToOne } from "typeorm";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { Quizz } from "./Quizz";
import { User } from "./User";

@ObjectType()
@Entity()
export class PerformedQuizz extends EntityWithBase(
  EntityWithDates(BaseEntity)
) {
  @Field(() => Quizz)
  @ManyToOne(() => Quizz)
  @JoinColumn()
  quizz: Quizz;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.performedQuizz)
  user: User;
}
