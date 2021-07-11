import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import { graphqlUploadExpress } from "graphql-upload";
import Redis from "ioredis";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Course } from "./entities/Course";
import { CourseDetail } from "./entities/CourseDetail";
import { CourseSession } from "./entities/CourseSession";
import { SessionFile } from "./entities/SessionFile";
import { User } from "./entities/User";
import { isAdmChecker } from "./middlewares/isAdm";
import { CourseResolver } from "./resolvers/course";
import { UploadResolver } from "./resolvers/upload";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, Course, CourseDetail, CourseSession, SessionFile],
  });
  // await conn.runMigrations();
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax", //csrf
        domain: __prod__ ? ".cbraggio.me" : undefined,
      },
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  const apolloServer = new ApolloServer({
    uploads: false,
    schema: await buildSchema({
      resolvers: [UserResolver, UploadResolver, CourseResolver],
      validate: false,
      authChecker: isAdmChecker,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      //   userLoader: createUserLoader(),
      //   updootLoader: createUpdootLoader(),
    }),
  });
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.listen(parseInt(process.env.PORT), () => {
    console.log(`server started on port ${process.env.PORT}`);
  });
};

main();
