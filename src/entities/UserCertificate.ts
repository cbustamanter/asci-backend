import { BaseEntity, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Course } from "./Course";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { User } from "./User";

@Entity()
export class UserCertificate extends EntityWithBase(
  EntityWithDates(BaseEntity)
) {
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course;
}
