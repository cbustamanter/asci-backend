import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany } from "typeorm";
import { CourseSession } from "./CourseSession";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";

@ObjectType()
@Entity()
export class CourseDetail extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  description!: string;

  @Field(() => String)
  @Column()
  coverPhoto!: string;

  @Field(() => String)
  @Column()
  startDate!: Date;

  @Field(() => String)
  @Column()
  endDate!: Date;

  @Field(() => String)
  @Column()
  classUrl!: String;

  @Field(() => [CourseSession])
  @OneToMany(
    () => CourseSession,
    (courseSession) => courseSession.courseDetail,
    { cascade: ["insert"] }
  )
  courseSessions: CourseSession[];
}
