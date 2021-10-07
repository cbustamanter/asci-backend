import sgMail from "@sendgrid/mail";
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
import { COOKIE_NAME, SENDGRID_KEY, __prod__ } from "./constants";
import { isAdmChecker } from "./middlewares/isAdm";
import { CourseResolver } from "./resolvers/course";
import { CertificateResolver } from "./resolvers/intranet/certificate/certificate";
import { IntranetCourseResolver } from "./resolvers/intranet/course";
import { IntranetSessionResolver } from "./resolvers/intranet/courseSession";
import { PerformedQuizzResolver } from "./resolvers/intranet/performedQuizz";
import { QuizResolver } from "./resolvers/quizz";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { Entities } from "./utils/Entities";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    // synchronize: true,
    logging: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: Entities,
  });
  await conn.runMigrations();
  sgMail.setApiKey(SENDGRID_KEY);
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
        domain: __prod__ ? ".asciperu.com" : undefined,
      },
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );
  app.use(graphqlUploadExpress({ maxFileSize: 524288000, maxFiles: 10 }));
  const apolloServer = new ApolloServer({
    uploads: false,
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        CourseResolver,
        QuizResolver,
        IntranetCourseResolver,
        IntranetSessionResolver,
        PerformedQuizzResolver,
        CertificateResolver,
      ],
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
    bodyParserConfig: {
      limit: "500mb",
    },
  });
  app.listen(parseInt(process.env.PORT), () => {
    console.log(`server started on port ${process.env.PORT}`);
  });
};

main();
