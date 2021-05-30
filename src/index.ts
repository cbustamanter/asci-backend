import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { User } from "./entities/User";
import { isAdmChecker } from "./middlewares/isAdm";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User],
  });
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
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
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
