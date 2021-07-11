import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CourseDetail } from "./CourseDetail";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { SessionFile } from "./SessionFile";

@ObjectType()
@Entity()
export class CourseSession extends EntityWithBase(EntityWithDates(BaseEntity)) {
  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column({ type: "time" })
  startTime!: Date;

  @Field(() => String)
  @Column({ type: "time" })
  endTime!: Date;

  @Field(() => String)
  @Column()
  recordingUrl: string;

  @Field(() => CourseDetail)
  @ManyToOne(() => CourseDetail, (courseDetail) => courseDetail.courseSessions)
  courseDetail: CourseDetail;

  @Field(() => [SessionFile], { nullable: true })
  @OneToMany(() => SessionFile, (sessionFile) => sessionFile.courseSession, {
    cascade: ["insert"],
  })
  sessionFiles: SessionFile[];
}
