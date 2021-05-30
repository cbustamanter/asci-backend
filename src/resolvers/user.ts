import argon2 from "argon2";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";
import { isAuth } from "../middlewares/isAuth";
import { MyContext } from "../types";
import {
  EmailTakenResponse,
  LoginErrorMessageResponse,
} from "../utils/ErrorMessageResponse";
import { generateRandomPwd } from "../utils/generateRandomPwd";
import { PaginatedUsers } from "../utils/types/PaginatedUsers";
import { UserInput } from "../utils/types/UserInput";
import { UserResponse } from "../utils/types/UserResponse";
import validateCreateUser from "../utils/validations/validateCreateUser";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  genderText(@Root() user: User) {
    return user.gender === 0 ? "Femenino" : "Masculino";
  }

  @FieldResolver(() => String)
  statusText(@Root() user: User) {
    return user.status === 0 ? "Inactivo" : "Activo";
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => UserResponse)
  async createUser(@Arg("input") input: UserInput): Promise<UserResponse> {
    const errors = validateCreateUser(input);
    if (errors) {
      return { errors };
    }
    const randomPwd = generateRandomPwd();
    const hashedPwd = await await argon2.hash(randomPwd);
    console.log(randomPwd, hashedPwd);
    let user;
    try {
      const result = await User.create({
        names: input.names,
        surnames: input.surnames,
        email: input.email,
        password: hashedPwd,
        gender: input.gender,
        cellphone: input.cellphone,
        country: input.country,
      }).save();
      user = result;
    } catch (err) {
      if (err.code === "23505") {
        return EmailTakenResponse();
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse | null> {
    const user = await User.findOne({ email, status: 1 });
    if (!user) return LoginErrorMessageResponse();
    const valid = await argon2.verify(user.password, password);
    if (!valid) return LoginErrorMessageResponse();
    req.session.userId = user.id;
    return { user };
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => Boolean)
  async changeUserStatus(
    @Arg("id") id: string,
    @Arg("status", () => Int) status: number
  ): Promise<boolean> {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ status })
      .where('"id" = :id', { id })
      .execute();
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(true);
      })
    );
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    const id = req.session.userId;
    if (!id) {
      return undefined;
    }
    return await User.findOne(id);
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Query(() => PaginatedUsers)
  async getUsers(
    @Arg("limit", () => Int) limit: number,
    @Arg("status", () => Int, { nullable: true }) status: number,
    @Arg("search", () => String, { nullable: true }) search: string,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedUsers> {
    // filter by status = inactive(0), active(1), all(2)
    const realLimit = Math.min(50, limit);
    const fakeLimit = realLimit + 1;
    const qb = await getConnection()
      .getRepository(User)
      .createQueryBuilder("u")
      .orderBy("u.createdAt", "DESC")
      .limit(fakeLimit);
    if (cursor) {
      qb.where("u.createdAt < :cursor", { cursor: new Date(parseInt(cursor)) });
    }
    if (typeof status === "number" && status !== 2) {
      qb.andWhere("u.status = :status", { status });
    }
    if (search) {
      qb.andWhere(
        "(LOWER(u.names) like :search OR LOWER(u.surnames) like :search OR LOWER(u.email) like :search)",
        { search: `%${search}%` }
      );
    }
    qb.andWhere("u.role = 1");
    const users = await qb.getMany();
    return {
      users: users.slice(0, realLimit),
      hasMore: users.length === fakeLimit,
    };
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Query(() => User)
  async getUser(@Arg("id") id: string): Promise<User | undefined> {
    return User.findOne(id);
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("id") id: string,
    @Arg("input") input: UserInput
  ): Promise<UserResponse> {
    if (input.password) {
      input.password = await argon2.hash(input.password);
    }
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .update(User, { ...input })
        .returning("*")
        .where("id = :id", { id })
        .execute();
      user = result.raw[0];
    } catch (err) {
      if (err.code === "23505") {
        return EmailTakenResponse();
      }
    }
    return { user };
  }
}
