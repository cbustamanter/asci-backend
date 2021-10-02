import { BaseEntity, Entity, JoinColumn, OneToOne } from "typeorm";
import { Course } from "./Course";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { User } from "./User";

@Entity()
export class UserCertificate extends EntityWithBase(
  EntityWithDates(BaseEntity)
) {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Course)
  @JoinColumn()
  course: Course;
}
