import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Course } from "./Course";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { PerformedQuizz } from "./PerformedQuizz";
import { QuizzDetail } from "./QuizzDetail";

@ObjectType()
@Entity()
export class Quizz extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field(() => Int)
  @Column({ type: "smallint", default: 1 })
  status: number; //1: active, 2: inactive

  @Field(() => Course)
  @OneToOne(() => Course, (course) => course.quizz)
  @JoinColumn()
  course: Course;

  @Field(() => QuizzDetail, { nullable: true })
  @OneToOne(() => QuizzDetail, { cascade: ["insert", "update"] })
  @JoinColumn()
  quizzDetail: QuizzDetail;

  @Field(() => [PerformedQuizz])
  @OneToMany(() => PerformedQuizz, (performedQuizz) => performedQuizz.quizz)
  @JoinColumn()
  performedQuizz: PerformedQuizz[];
}
