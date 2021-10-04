import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { Course } from "./Course";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { PerformedQuizz } from "./PerformedQuizz";

@ObjectType()
@Entity()
export class User extends EntityWithDates(EntityWithBase(BaseEntity)) {
  @Field(() => String)
  @Column()
  names!: string;

  @Field(() => String)
  @Column()
  surnames!: string;

  @Column()
  password!: string;

  @Field(() => Int)
  @Column({ type: "smallint", default: 1 })
  gender!: number; // 1: male 2:female

  @Field(() => String)
  @Column()
  cellphone!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Field(() => Int)
  @Column({ type: "smallint", default: 1 })
  status: number; //  1: active || 2:inactive

  @Field(() => Int)
  @Column({ type: "smallint", default: 1 })
  role: number; // 1: USR || 2: ADM

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => [Course], { nullable: true })
  @ManyToMany(() => Course, (courses) => courses.users)
  courses?: Course[];

  @Field(() => PerformedQuizz)
  @OneToMany(() => PerformedQuizz, (performedQuizz) => performedQuizz.user)
  performedQuizz?: PerformedQuizz;
}
