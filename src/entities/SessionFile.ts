import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { CourseSession } from "./CourseSession";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";

@ObjectType()
@Entity()
export class SessionFile extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field(() => String, { nullable: true })
  @Column()
  filename: string;

  @Field(() => String, { nullable: true })
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column()
  mimetype: string;

  @Field(() => String, { nullable: true })
  @Column()
  encoding: string;

  @Field(() => CourseSession)
  @ManyToOne(
    () => CourseSession,
    (courSession) => courSession.courseSessionFiles,
    { onDelete: "CASCADE" }
  )
  courseSession: CourseSession;
}
