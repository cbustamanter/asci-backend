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
import { getConnection, getRepository, In } from "typeorm";
import { v4 } from "uuid";
import {
  COOKIE_NAME,
  FB_URL,
  FORGOT_PASSWORD_PREFIX,
  LINKEDIN_URL,
  TELEGRAM_URL,
  WEB_URL,
  WSP_NMB,
  YT_URL,
} from "../constants";
import { EmailController } from "../controllers/intranet/mail/EmailController";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { isAuth } from "../middlewares/isAuth";
import { MyContext } from "../types";
import {
  EmailTakenResponse,
  LoginErrorMessageResponse,
} from "../utils/ErrorMessageResponse";
import { generateRandomPwd } from "../utils/generateRandomPwd";
import { MailTmpl } from "../utils/templates/MailTmpl";
import { ForgotPasswordResponse } from "../utils/types/ForgotPasswordResponse";
import { PaginatedArgs } from "../utils/types/PaginatedArgs";
import { PaginatedUsers } from "../utils/types/PaginatedUsers";
import { UserInput } from "../utils/types/UserInput";
import { UserResponse } from "../utils/types/UserResponse";
import validateCreateUser from "../utils/validations/validateCreateUser";
import { validateForgotPassword } from "../utils/validations/validateForgotPassword";

@Resolver(User)
export class UserResolver {
  private repo = getRepository(User);
  private courseRepo = getRepository(Course);
  private mailSender = new EmailController();

  @FieldResolver(() => String)
  genderText(@Root() user: User) {
    return user.gender === 0 ? "Femenino" : "Masculino";
  }

  @FieldResolver(() => String)
  statusText(@Root() user: User) {
    return user.status === 2 ? "Inactivo" : "Activo";
  }

  @FieldResolver(() => String)
  statusAction(@Root() user: User) {
    return user.status === 2 ? "Activar" : "Desactivar";
  }

  @FieldResolver(() => Int)
  totalCourses(@Root() user: User) {
    return user.courses?.length || 0;
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
    const hashedPwd = await argon2.hash(randomPwd);
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
      const msg = MailTmpl(
        user.email,
        "¡Bienvenido al aula virtual de ASCI Perú!",
        `<b>¡Gracias por confiar en ASCI Perú!</b><br>
        Bienvenido al aula virtual, te brindamos tu acceso:
        <ul>
          <li>Usuario: tu dirección correo electrónico</li>
          <li>Contraseña: ${randomPwd}</li>
        </ul>
        Por tu seguridad, no compartas tu acceso con nadie.
        <ul class="tick">
          <li>&#x2713; Dale me gusta a nuestra página de Facebook: <a href="${FB_URL}" target="_blank">${FB_URL}</a></li>
          <li>&#x2713; Síguenos en LinkedIn: <a href="${LINKEDIN_URL}" target="_blank">${LINKEDIN_URL}</a></li>
          <li>&#x2713; Suscríbete a nuestro canal de Youtube: <a href="${YT_URL}" target="_blank">${YT_URL}</a></li>
          <li>&#x2713; Agrega nuestro número de whatsapp: ${WSP_NMB}</li>
          <li>&#x2713; Únete a nuestro canal de Telegram: <a href="${TELEGRAM_URL}" target="_blank">${TELEGRAM_URL}</a></li>
        </ul>
        <i>ASCI Perú, compartimos más que conocimiento.</i>
        `
      );
      await this.mailSender.sendEmail(msg);
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
  async users(
    @Arg("args", () => PaginatedArgs) args: PaginatedArgs
  ): Promise<PaginatedUsers> {
    const repo = this.repo;
    const take = args.per_page || 10;
    const skip = (args.page - 1) * take;

    const qb = repo
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.courses", "c")
      .orderBy("u.createdAt", "DESC")
      .take(take)
      .skip(skip);

    if (args.status) {
      qb.andWhere("u.status = :status", { status: args.status });
    }
    if (args.search) {
      qb.andWhere(
        "(LOWER(u.names) like :search OR LOWER(u.surnames) like :search OR LOWER(u.email) like :search)",
        { search: `%${args.search}%` }
      );
    }
    qb.andWhere("u.role = 1");
    const [data, total] = await qb.getManyAndCount();
    return {
      prev: args.page > 1 ? args.page - 1 : null,
      data: data,
      totalPages: Math.ceil(total / take),
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
  @Query(() => [User], { nullable: true })
  async searchUsers(
    // @Arg("arg") arg: string,
    @Arg("courseId") courseId: string
  ): Promise<User[] | null> {
    // if (arg.length < 2) return null;
    const result = await this.repo
      .createQueryBuilder("u")
      .select("u")
      .leftJoin("u.courses", "c")
      // .where(
      //   "u.names LIKE :arg OR u.surnames like :arg OR u.email like :arg ",
      //   { arg: `%${arg}%` }
      // )
      .where("u.role = 1")
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("u.id")
          .from(User, "u")
          .leftJoin("u.courses", "c")
          .where("c_u.courseId = :courseId", { courseId })
          .orderBy("u.names", "ASC")
          .getQuery();
        return "u.id NOT IN " + subQuery;
      })
      .orderBy("LOWER(u.names)", "ASC")
      .getMany();

    return result;
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => Boolean, { nullable: true })
  async usersToCourse(
    @Arg("ids", () => [String]) ids: string[],
    @Arg("courseId") courseId: string
  ): Promise<boolean> {
    const users = await this.repo.find({ where: { id: In(ids) } });
    await this.courseRepo
      .createQueryBuilder()
      .relation(Course, "users")
      .of({ id: courseId })
      .add(users);
    return true;
  }

  @UseMiddleware(isAuth)
  @Authorized<number>(2)
  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("id") id: string,
    @Arg("input") input: UserInput
  ): Promise<UserResponse> {
    const errors = validateCreateUser(input);
    if (errors) {
      return { errors };
    }
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

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<ForgotPasswordResponse> {
    const errors = validateForgotPassword(email);
    const response = true;
    if (errors) {
      return { errors };
    }
    const user = await User.findOne({ email });
    if (!user) {
      return { response };
    }
    const token = v4();

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 1 // 1 day
    );
    const msg = MailTmpl(
      email,
      "Cambio de contraseña",
      `<a href="http://${WEB_URL}/change-password/${token}">Clic aquí para cambiar tu contraseña!</a>`
    );
    await this.mailSender.sendEmail(msg);
    return { response };
  }

  //TODO: Move validations to a separate file
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "La contraseña debe ser mayor a 3",
          },
        ],
      };
    }
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "El token ha expirado",
          },
        ],
      };
    }
    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "El usuario no existe",
          },
        ],
      };
    }
    await User.update(
      { id: userId },
      {
        password: await argon2.hash(newPassword),
      }
    );
    await redis.del(key);
    return { user };
  }

  @UseMiddleware(isAuth)
  @Query(() => [Course])
  async userCourses(@Ctx() { req }: MyContext): Promise<Course[]> {
    const result = await this.courseRepo
      .createQueryBuilder("c")
      .select(["c.id", "cd.id", "cd.name", "cd.description", "cd.coverPhoto"])
      .leftJoin("c.courseDetail", "cd")
      .leftJoin("c.users", "u")
      .where("u.id = :id", { id: req.session.userId })
      .getMany();
    return result;
  }
}
