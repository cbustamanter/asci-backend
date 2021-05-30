import { AuthChecker } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";

export const isAdmChecker: AuthChecker<MyContext> = async (
  { context },
  roles
) => {
  const id = context.req.session.userId;
  const user = await User.findOne(id);
  if (!user) {
    return false;
  }
  const parseRoles = roles.map((r) => parseInt(r));
  return parseRoles.includes(user.role);
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  // or false if access is denied
};
