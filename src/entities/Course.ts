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
  status: number; //1:active 2:inactive 3:havent started yet

  @Field(() => Boolean)
  @Column()
  hasTest!: boolean;

  @Field(() => CourseDetail)
  @OneToOne(() => CourseDetail, { cascade: ["insert"] })
  @JoinColumn()
  courseDetail: CourseDetail;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.courses)
  @JoinTable()
  users?: User[];
}
