import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from "typeorm";
import { CourseDetail } from "./CourseDetail";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { User } from "./User";

@ObjectType()
@Entity()
export class Course extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field(() => Int)
  @Column({ type: "smallint", default: 1 })
  status: number; //1:active 0:inactive 2:havent started yet

  @Field(() => CourseDetail)
  @OneToOne(() => CourseDetail, { cascade: ["insert", "update"] })
  @JoinColumn()
  courseDetail: CourseDetail;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.courses)
  @JoinTable()
  users?: User[];
}
